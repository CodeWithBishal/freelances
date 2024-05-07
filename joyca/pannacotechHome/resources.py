from .models import *
from import_export import resources

class storeDataAdmin(resources.ModelResource):
    class Meta:
        model   =  storeData
        exclude = ('id',)
        import_id_fields = ('sno',)
    # pass