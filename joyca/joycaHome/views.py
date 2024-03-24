from django.shortcuts import render
import xml.etree.ElementTree as ET
from django.http import HttpResponse
import requests
from .models import *

# Create your views here.
def index(request):
    context = {}
    return render(request,"index.html", context=context)

def youtube(request):
    dataYT = storeYTData.objects.all()
    context={"youtube":dataYT}
    return render(request,"youtube.html", context=context)

def youtubeFetchAPI():
    url = "https://www.youtube.com/feeds/videos.xml?channel_id=UCow2IGnug1l3Xazkrc5jM_Q"
    response = requests.get(url)
    if response.status_code == 200:
        xml_data = response.content

        # Parse XML content
        root = ET.fromstring(xml_data)

        # Namespace dictionary
        ns = {
            'yt': 'http://www.youtube.com/xml/schemas/2015',
            'media': 'http://search.yahoo.com/mrss/',
            'atom': 'http://www.w3.org/2005/Atom'
        }

        # Extract data from each <entry> element
        entries = {}
        for entry in root.findall('atom:entry', ns):
            entry_data = {}
            entry_data['id'] = entry.find('atom:id', ns).text
            entry_data['video_id'] = entry.find('yt:videoId', ns).text
            entry_data['channel_id'] = entry.find('yt:channelId', ns).text
            entry_data['title'] = entry.find('atom:title', ns).text
            entry_data['published'] = entry.find('atom:published', ns).text
            entry_data['updated'] = entry.find('atom:updated', ns).text
            entry_data['thumbnail_url'] = entry.find('.//media:thumbnail', ns).attrib['url']
            entry_data['description'] = entry.find('.//media:description', ns).text
            entry_data['views'] = entry.find('.//media:statistics', ns).attrib['views']
            entries[entry_data['video_id']] = entry_data
        first_entry_id = next(iter(entries.keys()))
        last_id_obj = StoreLastIDs.objects.get_or_create(platform='YouTube')
        if last_id_obj[0].lastID != first_entry_id:
            last_id_obj[0].platform = "YouTube"
            last_id_obj[0].lastID = first_entry_id
            last_id_obj[0].save()
            # Save new entries to the database
            for video_id, entry_data in entries.items():
                print("azasdasd")
                # Check if the entry already exists in the database to avoid duplicates
                if not storeYTData.objects.filter(videoIdYT=entry_data['video_id']).exists():
                    # Create a new record
                    if entry_data['description'] is not None:
                        description = entry_data['description']
                    else:
                        description = ""
                    storeYTData.objects.create(
                        dataURL=url,
                        publishDateYT=entry_data['published'],
                        videoIdYT=entry_data['video_id'],
                        videoTitleYT=entry_data['title'],
                        viewsYT=entry_data['views'],
                        thumbnailYT=entry_data['thumbnail_url'],
                        descriptionYT=description
                    )
        return HttpResponse(f"Status code: {response.status_code}")

    else:
        return HttpResponse(f"Failed to fetch XML data. Status code: {response.status_code}")
