import datetime
import random
import string

from base.models import Burger, Order, Store, User
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.shortcuts import redirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.html import strip_tags
from jwt import ExpiredSignatureError, decode, encode, exceptions
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import isVerifiedUser
from .serializers import (LoginSerializer, OrderSerializer, StoreSerializer,
                          UserSerializer, userSignupSerializer)


@api_view(["POST"])
def passwordChangeRequest(request):
    given_mail = request.data['email']
    user = User.objects.get(email=given_mail)
    generatedOtp = random.randint(100000, 999999)
    user.otp = generatedOtp
    user.save()
    html_message = render_to_string(
        'password_reset_template.html', {'context': generatedOtp})
    plain_message = strip_tags(html_message)
    send_mail(
        "Password Reset for {title}".format(title="Burger BY CR3W"),
        plain_message,
        "souravdebnath97@gmail.com",
        [given_mail],
        html_message=html_message
    )
    return Response({'message': "check your email for otp"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def passwordChangeConfirm(request):
    given_mail = request.data['email']
    given_otp = int(request.data['token'])
    pass1 = request.data['password1']
    pass2 = request.data['password2']
    print(given_mail, given_otp, pass1, pass2)
    user = User.objects.get(email=given_mail)

    if user.otp != given_otp:
        return Response({'message': "OTP doesn't match"}, status=status.HTTP_400_BAD_REQUEST)
    if pass1 != pass2:
        return Response({'message': "Password doesn't match"}, status=status.HTTP_401_BAD_REQUEST)
    if user.otp is not None and user.otp == given_otp and pass1 == pass2:
        user.set_password(pass1)
        user.otp = None
        user.save()
        return Response({'message': "Successfully changed the password"}, status=status.HTTP_200_OK)


class userSignupView(generics.GenericAPIView):
    serializer_class = userSignupSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        user_data = User.objects.get(email=serializer.data['email'])

        token = encode({'id': user_data.id},
                       settings.SECRET_KEY, algorithm='HS256')
        current_site = get_current_site(request).domain
        relative_link = reverse('email-verify')
        print('1')
        absurl = 'http://' + current_site + \
            relative_link + "?token=" + str(token)
        print('2')

        html_message = render_to_string('registration_confirm.html', {
            'fullname': user_data.fullname,
            'confirmationUrl': absurl
        })
        plain_message = strip_tags(html_message)
        send_mail(
            "Email Confirmation for Burger By CR3W",
            plain_message,
            "souravdebnath97@gmail.com",
            [user_data.email],
            html_message=html_message
        )

        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "message": "account created successfully",
            }
        )


class VerifyEmail(generics.GenericAPIView):

    @staticmethod
    def get(request):
        token = request.GET.get('token')
        try:
            payload = decode(token, settings.SECRET_KEY, algorithms='HS256')
            user = User.objects.get(id=payload['id'])
            if user.isVerified is False:
                user.isVerified = True
                user.save()
            return redirect("http://localhost:3000/login")

        except ExpiredSignatureError:
            return Response({'message': 'Activation Expired'}, status=status.HTTP_400_BAD_REQUEST)

        except exceptions.DecodeError:
            return Response({'message': 'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)


class customAuthToken(generics.GenericAPIView):

    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny, ]

    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token.key
        })


class LogoutView(APIView):
    def post(self, request, format=None):
        request.auth.delete()
        return Response(status=status.HTTP_200_OK)


class continuousVerificationView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


def generateOrderId():
    res1 = ''.join(random.choices(string.ascii_uppercase +
                                  string.digits, k=4))
    res2 = ''.join(random.choices(string.ascii_uppercase +
                                  string.digits, k=4))
    res3 = ''.join(random.choices(string.ascii_uppercase +
                                  string.digits, k=4))
    res4 = ''.join(random.choices(string.ascii_uppercase +
                                  string.digits, k=4))
    return res1+'-'+res2+'-'+res3+'-'+res4


@api_view(["POST"])
def createOrder(request):
    email = request.data['email']
    totalPrice = int(request.data['totalPrice'])
    salad = int(request.data['salad'])
    bacon = int(request.data['bacon'])
    cheese = int(request.data['cheese'])
    meat = int(request.data['meat'])
    user = User.objects.get(email=email)
    burger = Burger.objects.create(
        salad=salad, bacon=bacon, cheese=cheese, meat=meat)
    uniqueId = generateOrderId()
    order = Order.objects.create(
        user=user, burger=burger, total_price=totalPrice, order_id=uniqueId, delivered=False, order_time=datetime.datetime.now(), deliver_time=None)
    html_message = render_to_string(
        'order_confirmation_template.html', {'context': uniqueId})
    plain_message = strip_tags(html_message)
    send_mail(
        "Order ID for {title}".format(title="Burger Builder By CR3W"),
        plain_message,
        "souravdebnath97@gmail.com",
        [email],
        html_message=html_message
    )
    return Response({
        'orderId': uniqueId
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
def getAllOrder(request):
    email = request.data['email']
    user = User.objects.get(email=email)
    order = Order.objects.filter(user=user).order_by('-order_time')
    return Response({
        'orders': OrderSerializer(order, many=True).data
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
def getAdminAllOrder(request):
    order = Order.objects.filter(delivered=False)
    return Response({
        'orders': OrderSerializer(order, many=True).data
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
def getAdminAcceptedOrder(request):
    order = Order.objects.filter(delivered=True).order_by('-order_time')
    return Response({
        'orders': OrderSerializer(order, many=True).data
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
def getIndividualOrder(request, id):
    email = request.data['email']
    user = User.objects.get(email=email)
    order = Order.objects.get(user=user, id=id)
    return Response({
        'orders': OrderSerializer(order).data
    }, status=status.HTTP_200_OK)


@api_view(["POST"])
def getIndividualAdminOrder(request, id):
    try:
        email = request.data['email']
        user = User.objects.get(email=email)
        if user.is_superuser:
            order = Order.objects.get(id=id)
            return Response({
                'orders': OrderSerializer(order).data
            }, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def adminAcceptOrder(request):
    try:
        email = request.data['email']
        id = request.data['id']
        user = User.objects.get(email=email)
        if user.is_superuser:
            order = Order.objects.get(id=id)

            order.delivered = True
            print(1)
            order.deliver_time = datetime.datetime.now()
            print(2)
            order.save()
            print(3)
            return Response({
                'message': 'successfully accepted'
            }, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def checkOpen(request):
    open = Store.objects.get(id=1)
    newOpen = StoreSerializer(open).data
    return Response({'open': newOpen}, status=status.HTTP_200_OK)


@api_view(["GET"])
def storeOpen(request):
    open = Store.objects.get(id=1)
    open.open = True
    open.save()
    return Response({'open': True}, status=status.HTTP_200_OK)


@api_view(["GET"])
def storeClose(request):
    open = Store.objects.get(id=1)
    open.open = False
    open.save()
    return Response({'open': False}, status=status.HTTP_200_OK)
