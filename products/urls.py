from django.urls import path
from .views import CategoryListCreateView, ProductListCreateView, ProductDetailView, ReviewCreateView

urlpatterns = [
    path('categories/',         CategoryListCreateView.as_view(), name='category-list'),
    path('',                    ProductListCreateView.as_view(),  name='product-list'),
    path('<int:pk>/',           ProductDetailView.as_view(),      name='product-detail'),
    path('<int:pk>/reviews/',   ReviewCreateView.as_view(),       name='product-review'),
]