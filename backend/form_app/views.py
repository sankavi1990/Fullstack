import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.conf import settings

GROQ_API_KEY = settings.GROQ_API_KEY

def call_ai(prompt):
    try:
        response = requests.post(
            url="https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 500
            },
            timeout=30
        )
        data = response.json()
        print("Groq Response:", data)

        if 'choices' in data:
            return data['choices'][0]['message']['content']
        return None

    except Exception as e:
        print(f"Groq error: {str(e)}")
        return None


class FormSuggestionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        name = request.data.get('name', '')
        email = request.data.get('email', '')
        message = request.data.get('message', '')

        if not name or not email or not message:
            return Response(
                {"error": "All fields are required!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        prompt = f"""
        A user submitted a form with the following details:
        - Name: {name}
        - Email: {email}
        - Message: {message}

        Please analyze and suggest improvements for:
        1. Name format (proper capitalization)
        2. Email validity
        3. Message clarity and professionalism

        Keep your response short, friendly and helpful.
        """

        suggestion = call_ai(prompt)

        if suggestion:
            return Response({
                "message": "Form received successfully!",
                "suggestion": suggestion
            })
        else:
            return Response({
                "error": "AI service is temporarily unavailable. Please try again later."
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)