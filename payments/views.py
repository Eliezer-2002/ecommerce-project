from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer
from orders.models import Order
import uuid


class PaymentCreateView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        order = serializer.validated_data['order']
        # Simulate a successful payment
        payment = serializer.save(
            amount=order.total_price,
            status='completed',
            transaction_id=str(uuid.uuid4()),
        )
        # Update order status
        order.status = 'confirmed'
        order.save()


class PaymentDetailView(generics.RetrieveAPIView):
    serializer_class = PaymentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user)