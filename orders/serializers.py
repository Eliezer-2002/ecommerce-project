from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'quantity', 'price', 'subtotal')
        read_only_fields = ('id', 'price', 'product_name', 'subtotal')

    def get_subtotal(self, obj):
        return obj.get_subtotal()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    product_ids = serializers.ListField(
        child=serializers.DictField(), write_only=True
    )

    class Meta:
        model = Order
        fields = (
            'id', 'status', 'total_price', 'shipping_address',
            'items', 'product_ids', 'created_at',
        )
        read_only_fields = ('id', 'status', 'total_price', 'created_at')

    def create(self, validated_data):
        product_ids = validated_data.pop('product_ids')
        order = Order.objects.create(**validated_data)
        total = 0
        for item_data in product_ids:
            product = Product.objects.get(id=item_data['product_id'])
            quantity = item_data.get('quantity', 1)
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price,
            )
            total += product.price * quantity
        order.total_price = total
        order.save()
        return order