from django.urls import path

from . import views

urlpatterns = [

    path("signup/user/", views.userSignupView.as_view()),
    path("email-verify/", views.VerifyEmail.as_view(), name='email-verify'),
    path("login/", views.customAuthToken.as_view()),
    path("logout/", views.LogoutView.as_view()),
    path("checkauth/", views.continuousVerificationView.as_view()),
    path('password-change-request/', views.passwordChangeRequest),
    path('password-change-confirm/', views.passwordChangeConfirm),
    path('create-order/', views.createOrder),
    path('all-orders/', views.getAllOrder),
    path('order/<int:id>/', views.getIndividualOrder),

]
