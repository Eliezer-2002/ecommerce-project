from rest_framework import generics, permissions, filters
from .models import Category, Product, Review
from .serializers import CategorySerializer, ProductSerializer, ReviewSerializer


class IsSellerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_seller


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = (IsSellerOrReadOnly,)
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = ('name', 'description', 'category__name')
    ordering_fields = ('price', 'created_at')

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsSellerOrReadOnly,)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.seller == request.user


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        product_id = self.kwargs['pk']
        product = Product.objects.get(id=product_id)
        serializer.save(user=self.request.user, product=product)