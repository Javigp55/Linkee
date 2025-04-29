import os
from dotenv import load_dotenv
from rest_framework import status
from django.shortcuts import render
from .serializers import  TemporarySerializer, UserSerializer, LinksSerializer, CountrySerializer, VisitsSerializer, RefererSerializer, OperativeSystemSerializer
from .models import  TemporaryLink, Links, refresh_token, Country, Visits, OperativeSystem, Referer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from django.utils.timezone import now
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from .functions import Delete90Days, CreateDayAllTables, borrartemp,generar_codigo, qr_generator, RefererStats, get_tokens_for_user, pais, CountryStats, VisitStats, SysoStats
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from .authenticate import CookieAuth
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from urllib.parse import urlparse
from datetime import date, datetime
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.models import SocialAccount
from dj_rest_auth.registration.views import SocialLoginView
from django.views.decorators.csrf import csrf_exempt
from allauth.socialaccount.providers.oauth2.client import OAuth2Client

import requests


def add_visit():
    print(date.today())
    links = Links.objects.filter().all()
    for link in links:
        crear, create = Visits.objects.get_or_create(link=link, date=date.today())
    


load_dotenv()
url = os.getenv('URL')


#### CRUD LINKS REGISTRADOS
class LinksView(viewsets.ModelViewSet):
    serializer_class = LinksSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [CookieAuth]
    http_method_names = ['get', 'post','delete','patch']

    def get_queryset(self):
        links = Links.objects.filter(user=self.request.user)
        return links
    #######GET
    def list(self, request, *args, **kwargs):
        links = Links.objects.filter(user=request.user).all()
        serializer = self.get_serializer(links, many=True)
        count = Links.objects.filter(user=request.user).count()

        return Response({'list':serializer.data , 'count':count})
    ##########post
    def create(self, request):
        data=request.data
        if not request.data.get('name'):
            return Response({'error':"Name is required"}, status=status.HTTP_400_BAD_REQUEST)
        count = Links.objects.filter(user=request.user).count()
        if count >= 30:
            return Response({'error':"Limit of 30 reached"}, status=status.HTTP_400_BAD_REQUEST)
        qrurl = url+'p/'+request.data['name']
        qr = qr_generator(qrurl)
        serializer = LinksSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user = self.request.user, qr=qr)
            link = Links.objects.get(slug = request.data['name'].lower())
            print(link)
            Visits.objects.update_or_create(link=link, date = date.today())
            return Response({"message":"Link created succesfully."})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    ##PATCH
    def update(self, request, *args, **kwargs):
        link = self.get_object()
        data = request.data
        if 'qr' in data:
            del data['qr']
        if 'name' in data and link.name != data['name']:
            qrurl = url+'p/'+request.data['name']
            qr = qr_generator(qrurl)
            data['qr']=qr
        serializer = self.get_serializer(link, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Edit completed"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

####RECIBIR ENLACES PERMANENTES
@api_view(['GET'])
def get_url(request, id):
    print(request.META)

###########COMPROBAR QUE TRAE IP Y SI NO ES UNKNOWN
    if request.META.get('REMOTE_ADDR'):
        ip = pais(request.META.get('REMOTE_ADDR'))
        print(ip)
    else:
        ip = 'Unknown'
#######SI NO TIENE ID
    if not id:
        return Response({"error":"Name needed."})
    ###################SI NO TRAE REFERER
    if 'HTTP_REFERER' in request.META:
        parsed = urlparse(request.META['HTTP_REFERER'])
        referer = parsed.netloc
        
    else:
        referer = 'Direct'
#############SI NO TRAE OS
    if 'OS' in request.META:
        oss = request.META['OS']
    else:
        oss = 'Unknown'



    try:
        link = Links.objects.get(slug=id.lower())
        link.count = link.count+1
        link.save()

        #######CREAR VISITA POR PAIS
        country, created= Country.objects.update_or_create(link=link, country=ip, date=date.today())
        country.count = country.count + 1
        country.save()


        ###CREAR VISITA POR FECHA
        visit, created = Visits.objects.get_or_create(link=link , date=date.today())
        visit.count += 1 
        visit.save()

        ### CREAR VISITA POR OS
        syso , created = OperativeSystem.objects.get_or_create(link=link, os=oss, date=date.today())
        syso.count += 1
        syso.save()


            ### CREAR VISITA POR REFERER
        refer , created = Referer.objects.update_or_create(link=link, referer=referer, date=date.today())
        refer.count += 1
        refer.save()



        return Response({"url":link.url})
    except Links.DoesNotExist:
        return Response({"error":"El enlace no existe"}, status=status.HTTP_404_NOT_FOUND)


####################ESTADISTICAS GENERALES
@api_view(['GET'])
@authentication_classes([CookieAuth])
@permission_classes([IsAuthenticated])
def statistic(request):

    dias = request.GET.get('day', 1)
    link = Links.objects.filter(user=request.user).all()
    countries = Country.objects.filter(link__in=link)
    countryserialized = CountrySerializer(countries, many=True)
    countrystat = CountryStats(countryserialized.data, int(dias))
    
    visit = Visits.objects.filter(link__in=link)
    visitserializer = VisitsSerializer(visit, many=True)
    visitstats = VisitStats(visitserializer.data , int(dias))

    syso = OperativeSystem.objects.filter(link__in=link)
    sysoserializer = OperativeSystemSerializer(syso, many=True)
    sysostats = SysoStats(sysoserializer.data , int(dias))

    referer= Referer.objects.filter(link__in=link).all()
    refererserializer = RefererSerializer(referer, many=True)
    refererstat = RefererStats(refererserializer.data, int(dias))

    # print(countryser.data)
    return Response({"Country":countrystat, "Visits":visitstats , "OS":sysostats, "referer":refererstat})
        
       
###############ESTADISTICAS POR LINK
@api_view(['GET'])
@authentication_classes([CookieAuth])
@permission_classes([IsAuthenticated])
def get_statistic(request, id):
    dias = request.GET.get('day', 1)

    try:
        link = Links.objects.get(id=id)
        if link.user != request.user:
            return Response({"This is not yout link."})
        


        country = Country.objects.filter(link=link).all()
        serializer = CountrySerializer(country, many=True)
        countrystat = CountryStats(serializer.data, int(dias))

        visit = Visits.objects.filter(link=link).all()
        visitserializer = VisitsSerializer(visit, many=True)
        visitstat= VisitStats(visitserializer.data, int(dias))

        syso= OperativeSystem.objects.filter(link=link).all()
        sysoserializer = OperativeSystemSerializer(syso, many=True)
        sysostat = SysoStats(sysoserializer.data, int(dias))

        referer= Referer.objects.filter(link=link).all()
        refererserializer = RefererSerializer(referer, many=True)
        refererstat = RefererStats(refererserializer.data, int(dias))



        return Response({"country": countrystat, "visit":visitstat, "os":sysostat, "referer": refererstat} )


    except Links.DoesNotExist:
        return Response({"error":"El enlace no existe"})






######## ACORTADOR TEMPORAL
class TemporaryView(viewsets.ModelViewSet):
    serializer_class = TemporarySerializer
    queryset = TemporaryLink.objects.all()
    http_method_names = ['post']
####POST
    def create(self, request, *args, **kwargs):
        data = request.data
        name = generar_codigo(6)
        data['name'] = name
        qrurl = url+'t/'+name
        qr = qr_generator(qrurl)
        data['qr'] = qr
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            try:
                link = TemporaryLink.objects.get(name=name)
                return Response({"name":link.name,"url" :link.url,"creado" :link.created_at,"expira": link.expired_at,"qr":link.qr})
            except link.DoesNotExist:
                return Response({"error":"Ha ocurrido un error inesperado"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST )



############INFO TEMPORARY LINK
@api_view(['GET'])
def tempinfo(request, id):
    print(id)
    try:
        link = TemporaryLink.objects.get(name=id)
        actual = now().replace(tzinfo=None)
        expired = (link.expired_at).replace(tzinfo=None)
        if (actual > expired):
            link.delete()
            return Response({"error":"Enlace caducado."}, status=status.HTTP_400_BAD_REQUEST)
        

        return Response({"url" :link.url,"expira": link.expired_at}, status=status.HTTP_200_OK)
        
    except:
        return Response({"error":"Enlace caducado o inválido."}, status=status.HTTP_400_BAD_REQUEST)


############BORRAR TODOS LOS LINKS
@api_view(['POST'])
@authentication_classes([CookieAuth])
@permission_classes([IsAuthenticated])
def deleteAll(request):
    links = Links.objects.filter(user=request.user).all()
    links.delete()
    return Response({'message':'All links deleted.'})

#######BORRAR CUENTA USUARIO
@api_view(['POST'])
@authentication_classes([CookieAuth])
@permission_classes([IsAuthenticated])
def deleteAccount(request):
    user = User.objects.get(id=request.user.id)
    print(user)
    user.delete()
    response = Response({'message':'User deleted.'})
    response.delete_cookie('access_token',path='/', samesite='None')
    return response


#######CAMBIAR CONTRASEÑA
@api_view(['POST'])
@authentication_classes([CookieAuth])
@permission_classes([IsAuthenticated])
def ChangePassword(request):
    if not request.data.get('actual') or not request.data.get('new') or not request.data.get('confirm'):
        return Response({"error":"All fields are required"} , status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.get(id=request.user.id)
    passw = user.check_password(request.data['actual'])
    if not passw:
        return Response({"error":"Incorrect actual password."}, status=status.HTTP_400_BAD_REQUEST)
    if request.data['new'] != request.data['confirm']:
        return Response({"error":"New and Confirm password not match."}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(str(request.data['new']))
    user.save()
    return Response({"message":"Password updated sucesfully."}, status=status.HTTP_200_OK)



#####REGISTRO/LOGIN/ LOGOUT

# @api_view(['POST'])
# def register(request):
#     serializer = UserSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         user = User.objects.get(username=request.data['username'])
#         user.set_password(str(request.data['password']))
#         user.save()
#         return Response({"message":"Usuario creado con exito."})
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ########LOGIN
# @api_view(['POST'])
# def login(request):
#     if not request.data.get('username') or not request.data.get('password'):
#         return Response({"error":"Email and password required."}, status=status.HTTP_400_BAD_REQUEST)
#     try:
#         user = User.objects.get(username=request.data['username'])
#         passw = user.check_password(request.data['password'])
#         print(passw)
#         if not passw:
#             return Response({"error":"Password is wrong"}, status=status.HTTP_400_BAD_REQUEST)
        
#         data = get_tokens_for_user(user)

#         response = Response({"message": "True"}, status=status.HTTP_200_OK)
#         #Generamos la cookie con nuestro access data en el response y sera guardado en navegador.
#         response.set_cookie(
#             key="access_token",
#             path='/', 
#             value=data['access'], 
#             httponly=True,     # protección contra XSS
#             secure=True,      # requiere HTTPS
#             samesite="None", # CSRF
#             domain='.backend.com'   ,
#             max_age=60 * 60 * 24 * 7 ,# 7 dias
#         )
#         token, created = refresh_token.objects.update_or_create(
#             user=user, 
#             defaults={'token':data['refresh'], 'access':data['access']}
#             )
#         return response
#     except User.DoesNotExist:
#         return Response({"error":"User not exist."}, status=status.HTTP_400_BAD_REQUEST)



##############OAUTH GOOGLE
class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    
    def post(self, request, *args, **kwargs):
        url = 'https://oauth2.googleapis.com/token'
        data = {
            "code": request.data['code'],
            "client_id": os.getenv('GOOGLE_CLIENT_ID'),
            "client_secret": os.getenv('GOOGLE_CLIENT_SECRET'),
            "redirect_uri": os.getenv('REDIRECT_URI'),
            "grant_type": "authorization_code"
        }
        response = requests.post(url, data=data)
        
        print(request.data)
        if response.status_code == 200:
            respuesta = response.json()
            request.data['access_token'] = respuesta['access_token']
            del request.data['code']
        else:
            print(response.json())
            return Response({"error":"Invalid google code."}, status=status.HTTP_400_BAD_REQUEST)

        response = super().post(request, *args, **kwargs)

        user = self.user
        print(user)
        try:
            refreshactual = refresh_token.objects.get(user=user)
            token = RefreshToken(refreshactual.token)
            token.blacklist()
        except:
            pass
        refresh = RefreshToken.for_user(user)

        
        socialacc = SocialAccount.objects.get(user=user)

        token, created = refresh_token.objects.update_or_create(
            user=user, 
            defaults={'token':refresh, 'access':response.data['access']}
            )
        response.set_cookie(
            key="access_token",
            path='/', 
            value=response.data['access'], 
            httponly=True,     # protección contra XSS
            secure=True,      # requiere HTTPS
            samesite="None", # CSRF
            domain=os.getenv('DOMAIN_COOKIE')    ,
            max_age=60 * 60 * 24 * 7 ,# 7 dias
        )
        del response.data['access']
        del response.data['refresh']
        del response.data['user']['pk']
        del response.data['user']['first_name']
        del response.data['user']['last_name']
        response.data['user']['picture'] = socialacc.extra_data['picture']

        return response



#############GITHUB OAUTH
class CustomOAuth2Client(OAuth2Client):
    def __init__(self, *args, **kwargs):
        kwargs.pop('scope_delimiter', None)  # 🔥 Elimina el conflicto
        super().__init__(*args, **kwargs)

class CustomGitHubOAuth2Adapter(GitHubOAuth2Adapter):
    def complete_login(self, request, app, token, **kwargs):
        login = super().complete_login(request, app, token, **kwargs)
        # Obtener emails privados
        response = requests.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"token {token.token}"}
        )
        if response.status_code == 200:
            emails = response.json()
            primary_emails = [e['email'] for e in emails if e.get("primary")]
            if primary_emails:
                login.account.extra_data['email'] = primary_emails[0]
        return login

class GithubLogin(SocialLoginView):
    adapter_class = CustomGitHubOAuth2Adapter
    callback_url = os.getenv('REDIRECT_URI')  # Asegúrate de que esta URL sea válida
    client_class = CustomOAuth2Client
    def post(self, request, *args , **kwargs):

        response = super().post(request, *args, **kwargs)
        user = self.user
        social = SocialAccount.objects.get(user=user)
        email = False
        try:
            email = User.objects.get(email = social.extra_data['email'])
        except:
            pass
        print(email)
        print(user)
        print(email == user)
        if email and email != user:
            user.delete()
            return Response({"error":"This emails is currently use on Google."}, status=status.HTTP_400_BAD_REQUEST)
        
        user.email = social.extra_data['email']
        user.save()
        refresh = RefreshToken.for_user(user)
        token , created = refresh_token.objects.update_or_create(
                user=user, 
                defaults={'token':refresh, 'access':response.data['access']}
                )
        
        response.set_cookie(
                key="access_token",
                path='/', 
                value=response.data['access'], 
                httponly=True,     # protección contra XSS
                secure=True,      # requiere HTTPS
                samesite="None", # CSRF
                domain=os.getenv('DOMAIN_COOKIE')   ,
                max_age=60 * 60 * 24 * 7 ,# 7 dias
            )
        
        del response.data['access']
        del response.data['refresh']
        del response.data['user']['pk']
        del response.data['user']['first_name']
        del response.data['user']['last_name']
        response.data['user']['picture'] = social.extra_data['avatar_url']
        return response


#############LOGOUT
@api_view(["POST"])
@authentication_classes([CookieAuth]) #Se ejecuta la autentificacion que creamos en autheticate.py
@permission_classes([IsAuthenticated])
def logout(request):
    print(request.user)
    response = Response({"message":"Ok"})
    response.set_cookie(
            key="access_token",
            path='/', 
            value="", 
            httponly=True,     # protección contra XSS
            secure=True,      # requiere HTTPS
            samesite="None", # CSRF
            domain= os.getenv('DOMAIN_COOKIE')    ,
            max_age=0 ,# 7 dias
        )
    try:
        token = refresh_token.objects.get(user=request.user)
        token.delete()
    except:
        return Response({"error":"Token not valid"}, status=status.HTTP_400_BAD_REQUEST)
    return response




###########REFRESH JWT
@api_view(['POST'])
def refresh(request):

    ##Recibimos el access token de la cookie del navegador
    access_token = request.COOKIES.get('access_token')

    ##Si no hay cookie error
    if not access_token:
        return Response({"error":"No hay token disponible"}, status=status.HTTP_400_BAD_REQUEST)
    
    #Comprobar si existe en la base de datos
    try:
        token = refresh_token.objects.get(access=access_token)

        ##Una vez encontrado el access caducado cogemos el refreh que sigue funcionando
        refresh = token.token

        #Generamos un nuevo token
        nuevo_token = RefreshToken(refresh)

        #Lo metemos en una variable porque si lo llamas mas veces vuelve a generar mas
        nuevo_access = nuevo_token.access_token

        #Creamos el response con el set cookies con el nuevo access token
        response = Response({"message":"Refrescado con exito"})
        response.set_cookie(
            key="access_token",  
            value=str(nuevo_access),   
            path='/', 
            httponly=True,     # protección contra XSS
            secure=True,      # HTTPS
            samesite="None", # Evita CSRF 
            domain= os.getenv('DOMAIN_COOKIE')    ,
            max_age=60 * 60 * 24 * 7  # días
        )
        
        #el nuevo token lo metemos en el objeto
        token.access = nuevo_access

        #Guardamos
        token.save()
        return response
    except refresh_token.DoesNotExist:
        response = Response(
            {"error": "El token no existe"},
            status=status.HTTP_401_UNAUTHORIZED
        )
        response.set_cookie(
            key="access_token",
            path='/', 
            value="", 
            httponly=True,     # protección contra XSS
            secure=True,      # requiere HTTPS
            samesite="None", # CSRF
            domain='.backend.com'   ,
            max_age=0 ,# 7 dias
        )
        return response
    except TokenError as e: #Si no existe o es invalido
        response = Response(
            {"error": "El refresh token es inválido o ha expirado"},status=status.HTTP_401_UNAUTHORIZED)
        response.set_cookie(
            key="access_token",
            path='/', 
            value="", 
            httponly=True,     # protección contra XSS
            secure=True,      # requiere HTTPS
            samesite="None", # CSRF
            domain='.backend.com'   ,
            max_age=0 ,# 7 dias
        )
        return response
    

@api_view(['GET'])
def test(request):
    CreateDayAllTables()
    return Response({})