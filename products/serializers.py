from rest_framework import serializers
from .models import Category, Product, Review


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'user_email', 'rating', 'comment', 'created_at')
        read_only_fields = ('id', 'user_email', 'created_at')


class ProductSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    seller_email = serializers.CharField(source='seller.email', read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'description', 'price', 'stock',
            'image', 'is_active', 'category', 'category_name',
            'seller', 'seller_email', 'reviews', 'created_at',
        )
        read_only_fields = ('id', 'seller', 'created_at')