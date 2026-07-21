import os
import io
import json
import threading
import PyPDF2
from docx import Document
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings
from openai import OpenAI

# We use the OPENROUTER_API_KEY if available, else a standard OPENAI_API_KEY
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.environ.get("OPENROUTER_API_KEY")
)

def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"
    return text

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_text_from_image(file_path):
    # Using google-cloud-vision since it's in requirements.txt
    # Note: Requires GOOGLE_APPLICATION_CREDENTIALS to be set in environment
    try:
        from google.cloud import vision
        client = vision.ImageAnnotatorClient()
        with io.open(file_path, 'rb') as image_file:
            content = image_file.read()
        image = vision.Image(content=content)
        response = client.document_text_detection(image=image)
        if response.error.message:
            return ""
        return response.full_text_annotation.text
    except Exception as e:
        print(f"Vision API error: {e}")
        return ""

def parse_biodata(file_path, file_extension, user_id):
    try:
        text = ""
        ext = file_extension.lower()
        if ext == 'pdf':
            text = extract_text_from_pdf(file_path)
        elif ext in ['doc', 'docx']:
            text = extract_text_from_docx(file_path)
        elif ext in ['jpg', 'jpeg', 'png']:
            text = extract_text_from_image(file_path)
        else:
            raise ValueError("Unsupported file format")

        if not text.strip():
            raise ValueError("No text could be extracted from the document")

        # Call LLM
        prompt = f"""
        Extract the following fields from the given biodata text and return ONLY a valid JSON object.
        Fields to extract: full_name, gender, date_of_birth, marital_status, religion, caste_community, mother_tongue, height, complexion, about_me, education_level, occupation, income_bracket, location_city, location_country, hobbies, family_details.
        If a field is missing, set its value to null.
        
        Biodata text:
        {text[:4000]}
        """

        response = client.chat.completions.create(
            model="google/gemini-2.5-pro", # Can be changed depending on what is available in openrouter
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        try:
            result_json_str = response.choices[0].message.content
            result_json = json.loads(result_json_str)
        except Exception:
            # Fallback if the LLM doesn't return clean JSON
            result_json_str = response.choices[0].message.content.replace("```json", "").replace("```", "").strip()
            result_json = json.loads(result_json_str)

        notify_frontend(user_id, "success", result_json)
        
    except Exception as e:
        print(f"Error in background task: {e}")
        notify_frontend(user_id, "error", {"message": str(e)})
    finally:
        # Cleanup temp file
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except:
                pass

def notify_frontend(user_id, status, data):
    channel_layer = get_channel_layer()
    group_name = f'user_notifications_{user_id}'
    event = {
        'type': 'send_notification',
        'message': {
            'type': 'biodata_processed',
            'status': status,
            'data': data
        }
    }
    async_to_sync(channel_layer.group_send)(group_name, event)

def process_biodata_async(file_path, file_extension, user_id):
    thread = threading.Thread(target=parse_biodata, args=(file_path, file_extension, user_id))
    thread.start()
