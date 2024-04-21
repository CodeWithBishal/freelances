from django.shortcuts import render
import xml.etree.ElementTree as ET
from django.http import HttpResponse
import requests
from django.conf import settings
import os
from .models import *
import json
from django.utils.timezone import now
from datetime import datetime
from pathlib import Path
from ntscraper import Nitter

# Create your views here.
# youtubePfp = "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=UCow2IGnug1l3Xazkrc5jM_Q&fields=items(id%2Csnippet%2Fthumbnails)&key=AIzaSyDkJ3at6Kz5clyVJeykvZYfstdpGC2dmHs" #TODO


def format_count(count):
    if int(count) >= 1000 and int(count)<1000000:
        subsFormat = str(round(int(count)/1000,2))+"K"
    elif int(count) >= 1000000:
        subsFormat = str(round(int(count)/1000000,2))+"M"
    else:
        subsFormat = count
    return subsFormat

def download_video(url, filename, folder):
        BASE_DIR = Path(__file__).resolve().parent.parent
        directory = os.path.join(BASE_DIR, folder)
        if not os.path.exists(directory):
            os.makedirs(directory)
        filenameDir = os.path.join(directory, filename)
        response = requests.get(url)
        if response.status_code == 200:
            with open(filenameDir, 'wb') as f:
                print("done")
                f.write(response.content)
        else:
            return HttpResponse("Status: FAILED!")

def index(request):
    # response = requests.get(youtubePfp)
    # if response.status_code == 200:
        # data = json.loads(response.content)
        # high_thumbnail_url = data['items'][0]['snippet']['thumbnails']['high']['url']
    # headers = {'User-Agent': request.headers.get('HTTP_USER_AGENT')}
    # response = requests.get("https://twitter.com/JoycaOff/header_photo", headers=headers)
    # print(response.content)
    allData = storeData.objects.order_by("-publishDateYT")[:6]
    bannerYTData = bannerYT.objects.get()
    instaData = dpInsta.objects.get()
    twitterData = twitterDP.objects.get()
    context = {"allData":allData, "YTBanner":bannerYTData, "instaData":instaData, "twitterData":twitterData}
    return render(request,"index.html", context=context)

def youtube(request):
    allData = storeData.objects.filter(platform="YouTube").order_by("-publishDateYT")[:6]
    context = {"allData":allData}
    return render(request,"index.html", context=context)
def twitter(request):
    twitterData = twitterDP.objects.get()
    allData = storeData.objects.filter(platform="Twitter").order_by("-publishDateYT").distinct()
    context = {"allData":allData,"twitterData":twitterData}
    return render(request,"index.html", context=context)
def instagram(request):
    allData = storeData.objects.filter(platform="Instagram").order_by("-publishDateYT")[:6]
    context = {"allData":allData}
    return render(request,"index.html", context=context)

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
            last_id_obj[0].lastRun = now()
            # Save new entries to the database
            for videoData in entries.values():
                # print(storeData.objects.filter(videoIdYT=videoData["video_id"]).exists())
                # Check if the entry already exists in the database to avoid duplicates
                if not storeData.objects.filter(videoIdYT=videoData['video_id']).exists():
                    # Create a new record
                    if int(videoData['views']) >= 1000 and int(videoData['views'])<1000000:
                        viewsFormat = str(round(int(videoData['views'])/1000,2))+"K"
                    elif int(videoData['views']) >= 1000000:
                        viewsFormat = str(round(int(videoData['views'])/1000000,2))+"M"
                    else:
                        viewsFormat = videoData['views']
                    storeData.objects.create(
                        dataURL=url,
                        publishDateYT=videoData['published'],
                        videoIdYT=videoData['video_id'],
                        videoTitleYT=videoData['title'],
                        viewsYT=viewsFormat,
                        thumbnailYT=videoData['thumbnail_url'],
                        platform="YouTube",
                        channelNameYT="Joyca"
                    )
            last_id_obj[0].save()
        else:
            for videoData in entries.values():
                data = storeData.objects.filter(videoIdYT=videoData["video_id"]).order_by("-publishDateYT")
                if int(videoData['views']) >= 1000 and int(videoData['views'])<1000000:
                    viewsFormat = str(round(int(videoData['views'])/1000,2))+"K"
                elif int(videoData['views']) >= 1000000:
                    viewsFormat = str(round(int(videoData['views'])/1000000,2))+"M"
                else:
                    viewsFormat = videoData['views']
                dataContent = data.first()
                dataContent.dataURL = url
                dataContent.videoIdYT=videoData['video_id']
                dataContent.videoTitleYT=videoData['title']
                dataContent.viewsYT=viewsFormat
                dataContent.thumbnailYT=videoData['thumbnail_url']
                dataContent.platform="YouTube"
                dataContent.channelNameYT="Joyca"
                dataContent.storeTime=now()
                dataContent.save()
        return HttpResponse(f"Status code: {response.status_code}")

    else:
        return HttpResponse(f"Failed to fetch XML data. Status code: {response.status_code}")

def fetchBanner(request):
    youtubeBannerURL = "https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=UCow2IGnug1l3Xazkrc5jM_Q&key=AIzaSyDkJ3at6Kz5clyVJeykvZYfstdpGC2dmHs"
    response = requests.get(youtubeBannerURL)
    ytSubsCount = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCow2IGnug1l3Xazkrc5jM_Q&fields=items/statistics/subscriberCount&key=AIzaSyDkJ3at6Kz5clyVJeykvZYfstdpGC2dmHs"
    responseytSubsCount = requests.get(ytSubsCount)
    instaHeadersUA = {
        'User-Agent': 'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)'
    }
    instaBannerAndfollow = requests.get("https://i.instagram.com/api/v1/users/web_profile_info/?username=joyca", headers=instaHeadersUA)

    if response.status_code == 200 and responseytSubsCount.status_code == 200 and instaBannerAndfollow.status_code == 200:
        #youtubeBanner
        jsonRes  =response.json()
        image = jsonRes["items"][0]["brandingSettings"]["image"]["bannerExternalUrl"]
        bannerModel = bannerYT.objects.get_or_create()
        bannerModel[0].dataURL = image
        bannerModel[0].storeTime = now()
        #youtubeSubsCount
        jsonRes =responseytSubsCount.json()
        bannerModel[0].subsCount = format_count(jsonRes["items"][0]["statistics"]["subscriberCount"])
        bannerModel[0].save()

        #instagram
        instaModel = dpInsta.objects.get_or_create()
        jsonRes = instaBannerAndfollow.json()
        image = jsonRes["data"]["user"]["profile_pic_url_hd"]
        instaModel[0].dataURL = image
        instaModel[0].storeTime = now()
        
        for data in jsonRes["data"]["user"]["edge_owner_to_timeline_media"]["edges"]:
            instaIsSingle = False
            IsVideo = False
            videoURLInsta = None
            mediaLinks = []
            localMedLinks = []
            IsVideo = data["node"]["is_video"]
            instaPostID = data["node"]["id"]
            if IsVideo:
                instaVideoURL = data["node"]["video_url"]
                instaThumbnailURL = data["node"]["display_url"]
            else:
                if len(data["node"]["edge_sidecar_to_children"]["edges"])>1:
                    instaIsSingle = False
                    for imLinks in data["node"]["edge_sidecar_to_children"]["edges"]:
                        mediaLinks.append(imLinks["node"]["display_url"])
                else:
                    instaIsSingle = True
                    mediaLinks.append(data["node"]["edge_sidecar_to_children"]["edges"][0]["node"]["display_url"])
            postMessage = data["node"]["edge_media_to_caption"]["edges"][0]["node"]["text"]
            postedTime = datetime.fromtimestamp(data["node"]["taken_at_timestamp"])
            likes = format_count(data["node"]["edge_media_preview_like"]["count"])

            if not storeData.objects.filter(instaPostID = instaPostID).exists():
                if IsVideo == True:
                    download_video(instaVideoURL,f"{instaPostID}.mp4","static/instagram/videos")
                    videoURLInsta = f"{instaPostID}.mp4"
                if instaThumbnailURL != "":
                    download_video(instaThumbnailURL,f"{data["node"]["shortcode"]}.jpg",f"static/instagram/thumbnail/{data["node"]["shortcode"]}")
                if mediaLinks != [] or mediaLinks != "":
                    print(mediaLinks)
                    for index,value in enumerate(mediaLinks):
                        download_video(value,f"{data["node"]["shortcode"]}-{index}.jpg",f"static/instagram/media/{data["node"]["shortcode"]}")
                        localMedLinks.append(f"{data["node"]["shortcode"]}-{index}.jpg")
                storeData.objects.create(
                    instaThumbnailURL = f"{data["node"]["shortcode"]}.jpg",
                    instaIsVideo = IsVideo,
                    instaVideoURL = videoURLInsta,
                    instaDesc = postMessage,
                    instaPostID = instaPostID,
                    instaIsSingle = instaIsSingle,
                    instaMediaLinks = localMedLinks,
                    platform = "Instagram",
                    publishDateYT = postedTime,
                    instaLikes = likes,
                    instaPostLink = data["node"]["shortcode"]
                )
            else:
                instaDataa= storeData.objects.filter(instaPostID = instaPostID).first()
                # instaDataa.instaThumbnailURL=instaThumbnailURL
                instaDataa.instaIsVideo=IsVideo
                # instaVideoURL = videoURLInsta,
                instaDataa.instaDesc=postMessage
                instaDataa.instaPostID=instaPostID
                instaDataa.instaIsSingle=instaIsSingle
                # instaDataa.instaMediaLinks=mediaLinks
                instaDataa.instaLikes=likes
                instaDataa.instaPostLink = data["node"]["shortcode"]
                instaDataa.save()
        
        BASE_DIR = Path(__file__).resolve().parent.parent
        directory = os.path.join(BASE_DIR, "static")
        if not os.path.exists(directory):
            os.makedirs(directory)
        filename = os.path.join(directory, 'instagram.jpg')
        response = requests.get(image)
        with open(filename, 'wb') as f:
            f.write(response.content)

        
        instaModel[0].followerCount = format_count(jsonRes["data"]["user"]["edge_followed_by"]["count"])
        instaModel[0].save()
        
        return HttpResponse(f"Status code: {response.status_code}")
    else:
        return HttpResponse(f"Failed to fetch data. Status code: {response.status_code}")
    

def twitterScape(request):
    #Twitter
    scraper = Nitter(log_level=1, skip_instance_check=False)
    twitterDetsModel = twitterDP.objects.get_or_create()
    joyca_tweets = scraper.get_tweets("joycaoff", mode='user' ,number=30)
    for tweet in joyca_tweets['tweets']:
        dataExist =  storeData.objects.filter(tweetLink = tweet["link"]).exists()
        if tweet["is-retweet"] == False and not tweet["quoted-post"] and not dataExist:
            print(tweet["text"])
            isVid = False
            mediaURL = ""
            if tweet["videos"]:
                isVid = True
                mediaURL = tweet["videos"][0]
            elif tweet["pictures"]:
                isVid = False
                mediaURL = tweet["pictures"][0]
            
            input_datetime = datetime.strptime(tweet["date"], "%b %d, %Y · %I:%M %p %Z")
            formatted_datetime = input_datetime.strftime("%Y-%m-%d %H:%M:%S.%U")
            storeData.objects.create(
                tweetText = tweet["text"],
                twitterLikes = format_count(tweet["stats"]["likes"]),
                tweetLink = tweet["link"],
                twitterIsVideo = isVid,
                twitterMediaURL= mediaURL,
                platform = "Twitter",
                publishDateYT = formatted_datetime,
            )
        else:
            twitterDataa = storeData.objects.filter(tweetText = tweet["text"]).first()
            twitterDataa.tweetText = tweet["text"]
            twitterDataa.twitterLikes = format_count(tweet["stats"]["likes"])
            twitterDataa.tweetLink = tweet["link"]
            # twitterDataa.twitterIsVideo=isVid
            twitterDataa.twitterMediaURL=mediaURL
            twitterDataa.save()
    
    
    joyca_information = scraper.get_profile_info("joycaoff")
    twitterDetsModel[0].dpURL = joyca_information["image"]
    twitterDetsModel[0].followerCount = format_count(joyca_information["stats"]["followers"])
    twitterDetsModel[0].storeTime=now()
    twitterDetsModel[0].save()
    return HttpResponse("Status: OK")