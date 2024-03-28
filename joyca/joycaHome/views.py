from django.shortcuts import render
import xml.etree.ElementTree as ET
from django.http import HttpResponse
import requests
from .models import *
import json

# Create your views here.
# youtubePfp = "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=UCow2IGnug1l3Xazkrc5jM_Q&fields=items(id%2Csnippet%2Fthumbnails)&key=AIzaSyCsZ-F4iyCL-ScTOoE5WGlllQzpFry1zNY" #TODO
youtubeBannerURL = "https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=UCow2IGnug1l3Xazkrc5jM_Q&key=AIzaSyCsZ-F4iyCL-ScTOoE5WGlllQzpFry1zNY"
def index(request):
    # response = requests.get(youtubePfp)
    # if response.status_code == 200:
        # data = json.loads(response.content)
        # high_thumbnail_url = data['items'][0]['snippet']['thumbnails']['high']['url']
    # headers = {'User-Agent': request.headers.get('HTTP_USER_AGENT')}
    # response = requests.get("https://twitter.com/JoycaOff/header_photo", headers=headers)
    # print(response.content)
    allData = storeData.objects.order_by("storeTime")[:6]
    context = {"allData":allData}
    return render(request,"index.html", context=context)

def youtube(request):
    dataYT = storeData.objects.filter(platform="YouTube")
    context={"youtube":dataYT}
    return render(request,"youtube.html", context=context)

def youtubeFetchAPI(request):
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
                # Check if the entry already exists in the database to avoid duplicates
                if not storeData.objects.filter(videoIdYT=entry_data['video_id']).exists():
                    # Create a new record
                    storeData.objects.create(
                        dataURL=url,
                        publishDateYT=entry_data['published'],
                        videoIdYT=entry_data['video_id'],
                        videoTitleYT=entry_data['title'],
                        viewsYT=entry_data['views'],
                        thumbnailYT=entry_data['thumbnail_url'],
                        platform="YouTube",
                        channelNameYT="Joyca"
                    )
        return HttpResponse(f"Status code: {response.status_code}")

    else:
        return HttpResponse(f"Failed to fetch XML data. Status code: {response.status_code}")
