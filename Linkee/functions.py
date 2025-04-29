import requests
import random
import string
import qrcode
import io
import base64
from datetime import datetime, timedelta, date
import geoip2.database
from .models import  TemporaryLink, Visits, Links, Referer, Country, OperativeSystem
from rest_framework_simplejwt.tokens import RefreshToken


#############GENERAR CODIGO PARA TEMPORAL
def generar_codigo(longitud):
    caracteres = string.ascii_letters + string.digits  # Letras (a-z, A-Z) + números (0-9)
    codigo = ''.join(random.choices(caracteres, k=longitud))
    return codigo

#########GENERAR QR
def qr_generator(link):
    qr = qrcode.make(link)
    # Guardar el QR en un buffer
    buffer = io.BytesIO()
    qr.save(buffer, format='PNG')
    # Convertir el QR a base64
    img_base64 = base64.b64encode(buffer.getvalue()).decode()
    return img_base64

##########RECIBIR TOKEN REFRESH
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }



############COGER PAIS POR IP
def pais(ip):

    reader = geoip2.database.Reader('./Geo.mmdb')
    try:
        response = reader.country(ip)
        reader.close()
        return response.country.name
    except:
        print('IP no valida')
        return 'Unknown'

###########ESTADISTICAS
def CountryStats(dic, dias):
    estadistica={}
    today = datetime.today().date()
    filterdate = today - timedelta(dias)

    for suelto in dic:
        fecha = datetime.strptime(suelto['date'], "%Y-%m-%d").date()
        if fecha > filterdate:
            pais = suelto['country']
            if pais not in estadistica:
                estadistica[pais] = suelto['count']

            else:
                estadistica[pais] += suelto['count']
    result = [{'name': country, 'count': count} for country, count in estadistica.items()]
    result.sort(key=lambda x: x['count'], reverse=True)
    return result


def VisitStats(dic, dias):
    estadistica = {}
    today = datetime.today().date()
    filterdate = today - timedelta(dias)
    for one in dic:
        fecha = datetime.strptime(one['date'], "%Y-%m-%d").date()
        if fecha > filterdate:
            visit = one['date']
            if visit not in estadistica:
                estadistica[visit] = one['count']
            else:
                estadistica[visit] += one['count']
    print(estadistica)
    result = [{'date': date, 'count': count} for date, count in estadistica.items()]
    result.sort(key=lambda x: x['date'])
    return result


def SysoStats(dic, dias):
    estadistica = {}
    today = datetime.today().date()
    filterdate = today - timedelta(dias)
    for one in dic:
        fecha = datetime.strptime(one['date'], "%Y-%m-%d").date()
        if fecha > filterdate:
            visit = one['os']
            if visit not in estadistica:
                estadistica[visit] = one['count']
            else:
                estadistica[visit] += one['count']
    print(estadistica)
    result = [{'name': os, 'count': count} for os, count in estadistica.items()]
    result.sort(key=lambda x: x['count'], reverse=True)
    return result

def RefererStats(dic, dias):
    
    estadistica = {}
    today = datetime.today().date()
    filterdate = today - timedelta(dias)
    for one in dic:
        fecha = datetime.strptime(one['date'], "%Y-%m-%d").date()
        if fecha > filterdate:
            visit = one['referer']
            if visit not in estadistica:
                estadistica[visit] = one['count']
            else:
                estadistica[visit] += one['count']
    print(estadistica)
    result = [{'name': referer, 'count': count} for referer, count in estadistica.items()]
    result.sort(key=lambda x: x['count'], reverse=True)
    return result

##########BORRAR TEMPORARLES CUANDO CADUCAN
def borrartemp():
    temp = TemporaryLink.objects.filter(expired_at__lt=datetime.now()).all()
    print(temp)
    temp.delete()


###############CREAR TABLAS CON 0 VISITAS DIARIAS PARA CADA LINK
def CreateDayAllTables():
    #############COGEMOS TODOS LOS OBJETOS DE VISITAS QUE HAN SIDO CREADOS EL DIA DE HOY Y FILTRAMOS EL LINK PARA DESPUES EXCLUIR
    Visit = Visits.objects.filter(date=date.today()).values_list('link', flat=True)
    #############EXCLUIMOS LOS LINKS DONDE EL OBJETO ANTERIOR YA HA SIDO CREADO
    Urls = Links.objects.exclude(id__in=Visit)
    ########CREAMOS DICCIONARIO
    Dic = []
    for url in Urls:
        ###METEMOS EN DICCIONARIO CADA UNO DE LOS LINKS CON LA FECHA
        Dic.append(Visits(link=url, date=date.today()))
    #######CREAMOS LAS ENTRADAS CON UN BULK
    Visits.objects.bulk_create(Dic)
    print(Dic)


######BORRAR ESTADISTICAS MAS DE 90 DIAS
def Delete90Days():
    expired_date = date.today() - timedelta(days=90)
    try:
        DelVisit = Visits.objects.filter(date__lt=expired_date).all()
        DelVisit.delete()

        DelReferer = Referer.objects.filter(date__lt=expired_date).all()
        DelReferer.delete()

        DelSyso = OperativeSystem.objects.filter(date__lt=expired_date).all()
        DelSyso.delete()

        DelCountry = Country.objects.filter(date__lt=expired_date).all()
        DelCountry.delete()
    except:
        print("Ha ocurrido un error.")
