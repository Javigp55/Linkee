from django.urls import path, include
from rest_framework import routers
from .views import TemporaryView, LinksView, GoogleLogin, GithubLogin
from Linkee import views
from .views import test, refresh,ChangePassword, get_url,tempinfo, logout, get_statistic, statistic, deleteAll, deleteAccount
from django.views.decorators.csrf import csrf_exempt



router = routers.DefaultRouter()
router.register('temp', views.TemporaryView, 'temps')
router.register('link', views.LinksView, 'links')


urlpatterns = [
    path("api/", include(router.urls)),
    # path("api/register/", register, name="register"),
    # path("api/login/", login, name="login"),
    path("api/get_url/<id>", get_url, name="get_url"),
    path("api/tempinfo/<id>", tempinfo, name="tempinfo"),
    path("api/logout/", logout, name="logout"),
    path("api/get_statistic/<id>", get_statistic , name="get_statistic "),
    path("api/statistic/", statistic , name="statistic "),
    path("api/deleteall/", deleteAll , name="deleteAll"),    
    path("api/deleteaccount/", deleteAccount , name="deleteAccount"),  
    path("api/changepassword/", ChangePassword , name="ChangePassword"),  
    path("api/refresh/", refresh , name="refresh"),  
    path("api/test/", test , name="test"),  
    path('api/google/', csrf_exempt(GoogleLogin.as_view()), name='google_login'),
    path('api/github/', csrf_exempt(GithubLogin.as_view()), name='google_login'),
    path('accounts/', include('allauth.urls')),


]