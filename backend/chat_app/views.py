import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import ChatMessage

GROQ_API_KEY = settings.GROQ_API_KEY

def get_ai_response(message, chat_history):
    try:
        # Build conversation history for context
        messages = [
            {
                "role": "system",
                "content": "You are a helpful assistant. Keep responses concise and friendly."
            }
        ]

        # Add previous chat history for context
        for chat in chat_history:
            messages.append({"role": "user", "content": chat.message})
            messages.append({"role": "assistant", "content": chat.response})

        # Add current message
        messages.append({"role": "user", "content": message})

        response = requests.post(
            url="https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": messages,
                "max_tokens": 500
            },
            timeout=30
        )

        data = response.json()
        if 'choices' in data:
            return data['choices'][0]['message']['content']
        return "Sorry, I could not process your message. Please try again."

    except Exception as e:
        print(f"Groq error: {str(e)}")
        return "AI service is temporarily unavailable."


# Send message and get AI response
class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.data.get('message', '').strip()

        if not message:
            return Response(
                {"error": "Message cannot be empty!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get last 5 messages for context
        chat_history = ChatMessage.objects.filter(
            user=request.user
        ).order_by('-created_at')[:5][::-1]

        # Get AI response
        ai_response = get_ai_response(message, chat_history)

        # Save to database
        chat = ChatMessage.objects.create(
            user=request.user,
            message=message,
            response=ai_response
        )

        return Response({
            "id": chat.id,
            "message": chat.message,
            "response": chat.response,
            "created_at": chat.created_at
        })


# Get chat history
class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chats = ChatMessage.objects.filter(
            user=request.user
        ).order_by('created_at')

        data = [
            {
                "id": chat.id,
                "message": chat.message,
                "response": chat.response,
                "created_at": chat.created_at
            }
            for chat in chats
        ]

        return Response({"history": data})


# Clear chat history
class ClearHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        ChatMessage.objects.filter(user=request.user).delete()
        return Response({"message": "Chat history cleared!"})