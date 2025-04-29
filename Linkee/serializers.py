from rest_framework import serializers
from .models import TemporaryLink, Links, Country, Visits, Referer, OperativeSystem
from django.contrib.auth.models import User
from urllib.parse import urlparse



###SERIALIZADOR LINKS

class LinksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Links
        fields = ('__all__')
        read_only_fields = ['user','count']


    def create(self, validated_data):
        validated_data['slug'] = validated_data['name'].lower()
        if Links.objects.filter(slug=validated_data['slug']).exists():
            raise serializers.ValidationError("Name ya cogido")
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        if 'name' in validated_data:
            validated_data['slug'] = validated_data['name'].lower()
            if Links.objects.filter(slug=validated_data['slug']).exists():
                raise serializers.ValidationError("Name already exist")
        return super().update(instance, validated_data)
    
    def validate_url(self,data):
        url = urlparse(self.initial_data['url'])
        if url.scheme not in ["http", "https", "ftp", "file"]:
            raise serializers.ValidationError("El enlace no es una url valida")
        return data
    def validate(self, data):

    #Se ponen los campos que desees
        campos = {"user", "count"}

        #Se crear una intersection, la cual cogera las keys recibidas y las compara con los campos
        #Si existen en los dos valido traera el campo
        valido = campos.intersection(self.initial_data.keys())

        ##Si valido tiene datos
        if valido:
            raise serializers.ValidationError("Has introducido campos no validos.")
        return data











####SERIALIZADOR DE USUARIO
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('__all__')





####SERIALIZADOR LINKS TEMPORALES
class TemporarySerializer(serializers.ModelSerializer):
    class Meta:
        model = TemporaryLink
        #fields = ('url','created_at','expired_at')
        fields = ('__all__')


        ##Validacion para que los campos puestos no los traiga en la peticion POST
    def validate(self, data):

        #Se ponen los campos que desees
        campos = {"expired_at", "created_at"}

        #Se crear una intersection, la cual cogera las keys recibidas y las compara con los campos
        #Si existen en los dos valido traera el campo
        valido = campos.intersection(self.initial_data.keys())

        ##Si valido tiene datos
        if valido:
            raise serializers.ValidationError("Has introducido campos no validos.")
        return data
    
    def validate_url(self,data):
        url = urlparse(self.initial_data['url'])
        if url.scheme not in ["http", "https", "ftp", "file"]:
            raise serializers.ValidationError("El enlace no es una url valida")
        return data
    



class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('__all__')


class VisitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visits
        fields = ('__all__')

class RefererSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referer
        fields = ('__all__')

class OperativeSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperativeSystem
        fields = ('__all__')
