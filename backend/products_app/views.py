from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Product
from django.conf import settings

class ProductSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get('q', '')
        category = request.query_params.get('category', '')

        products = Product.objects.all()

        if query:
            products = products.filter(name__icontains=query)

        if category:
            products = products.filter(category__icontains=category)

        data = [
            {
                "id": p.id,
                "name": p.name,
                "category": p.category,
                "price": str(p.price),
                "description": p.description,
                "in_stock": p.in_stock,
                "image": request.build_absolute_uri(p.image.url) if p.image else None
            }
            for p in products
        ]

        return Response({
            "count": len(data),
            "results": data
        })