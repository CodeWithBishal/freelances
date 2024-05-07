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
from django.core.paginator import Paginator
from decouple import config
import re

# Create your views here.
# youtubePfp = "https://www.googleapis.com/youtube/v3/channels?part=snippet&id=UCZO7iTy_uLmPbZiofPJpeXA&fields=items(id%2Csnippet%2Fthumbnails)&key=" #TODO


def is_image(url):
  """
  Checks if the given URL points to an image.

  Args:
      url: The URL to check.

  Returns:
      True if the URL is an image, False otherwise.
  """
  return bool('.jpg' in url)


def format_count(count):
    if int(count) >= 1000 and int(count)<1000000:
        subsFormat = str(round(int(count)/1000,2))+"K"
    elif int(count) >= 1000000:
        subsFormat = str(round(int(count)/1000000,2))+"M"
    else:
        subsFormat = count
    return subsFormat

def extract_twitter_id(url):
    # Split the URL by "/"
    parts = url.split("/")
    
    # Get the last part of the URL
    last_part = parts[-1]
    
    # Remove any anchor or query string if present
    twitter_id = last_part.split("#")[0].split("?")[0]
    
    return twitter_id

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
    # response = requests.get("https://twitter.com/pannacotech/header_photo", headers=headers)
    # print(response.content)
    bannerYTData = bannerYT.objects.first()
    instaData = dpInsta.objects.first()
    twitterData = twitterDP.objects.first()
    domainData = domain.objects.first()
    everyData = storeData.objects.order_by("-publishDateYT")
    paginator = Paginator(everyData, 6)
    total_pages = paginator.num_pages
    if request.GET.get('page'):
        allData = storeData.objects.order_by("-publishDateYT")
        paginator = Paginator(everyData, 6)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        context = {"allData":page_obj,"YTBanner":bannerYTData, "instaData":instaData, "twitterData":twitterData, "totalPage":total_pages, "domain":domainData}
    else:
        allData = storeData.objects.order_by("-publishDateYT")[:6]
        context = {"allData":allData,"YTBanner":bannerYTData, "instaData":instaData, "twitterData":twitterData, "totalPage":total_pages, "domain":domainData}
    return render(request,"index.html", context=context)

def youtube(request):
    bannerYTData = bannerYT.objects.first()
    instaData = dpInsta.objects.first()
    domainData = domain.objects.first()
    twitterData = twitterDP.objects.first()
    everyData = storeData.objects.filter(platform="YouTube").order_by("-publishDateYT")
    paginator = Paginator(everyData, 6)
    total_pages = paginator.num_pages
    if request.GET.get('page'):
        paginator = Paginator(everyData, 6)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        context = {"allData":page_obj,"YTBanner":bannerYTData, "instaData":instaData, "twitterData":twitterData, "totalPage":total_pages, "domain":domainData}
    else:
        allData = storeData.objects.filter(platform="YouTube").order_by("-publishDateYT")[:6]
        context = {"allData":allData,"YTBanner":bannerYTData, "instaData":instaData, "twitterData":twitterData, "totalPage":total_pages, "domain":domainData}
    return render(request,"index.html", context=context)
def twitter(request):
    bannerYTData = bannerYT.objects.first()
    instaData = dpInsta.objects.first()
    domainData = domain.objects.first()
    twitterData = twitterDP.objects.get()
    everyData = storeData.objects.filter(platform="Twitter").order_by("-publishDateYT")
    paginator = Paginator(everyData, 6)
    total_pages = paginator.num_pages
    if request.GET.get('page'):
        paginator = Paginator(everyData, 6)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        context = {"allData":page_obj,"YTBanner":bannerYTData, "instaData":instaData, "twitterData":twitterData, "totalPage":total_pages, "domain":domainData}
    else:
        allData = storeData.objects.filter(platform="Twitter").order_by("-publishDateYT")[:6]
        context = {"allData":allData,"YTBanner":bannerYTData, "instaData":instaData, "twitterData":twitterData, "totalPage":total_pages, "domain":domainData}
    return render(request,"index.html", context=context)
def instagram(request):
    bannerYTData = bannerYT.objects.first()
    instaData = dpInsta.objects.first()
    domainData = domain.objects.first()
    twitterData = twitterDP.objects.first()
    everyData = storeData.objects.filter(platform="Instagram").order_by("-publishDateYT")
    paginator = Paginator(everyData, 6)
    total_pages = paginator.num_pages
    if request.GET.get('page'):
        paginator = Paginator(everyData, 6)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        context = {"allData":page_obj,"YTBanner":bannerYTData, "instaData":instaData, "twitterData":twitterData, "totalPage":total_pages, "domain":domainData}
    else:
        allData = storeData.objects.filter(platform="Instagram").order_by("-publishDateYT")[:6]
        context = {"allData":allData,"YTBanner":bannerYTData, "instaData":instaData, "twitterData":twitterData, "totalPage":total_pages, "domain":domainData}
    return render(request,"index.html", context=context)

def youtubeFetchAPI(request):
    url = "https://www.youtube.com/feeds/videos.xml?channel_id=UCZO7iTy_uLmPbZiofPJpeXA"
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
                        channelNameYT="Pannacotech"
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
                dataContent.channelNameYT="Pannacotech"
                dataContent.storeTime=now()
                dataContent.save()
        return HttpResponse(f'Status code: {response.status_code}')

    else:
        return HttpResponse(f'Failed to fetch XML data. Status code: {response.status_code}')

def fetchBanner(request):
    youtubeBannerURL = f'https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=UCZO7iTy_uLmPbZiofPJpeXA&key={config("YT_API")}'
    response = requests.get(youtubeBannerURL)
    ytSubsCount = f'https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCZO7iTy_uLmPbZiofPJpeXA&fields=items/statistics/subscriberCount&key={config("YT_API")}'
    responseytSubsCount = requests.get(ytSubsCount)
    # instaHeadersUA = {
    #     'User-Agent': 'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)'
    # }
    # instaBannerAndfollow = requests.get("https://i.instagram.com/api/v1/users/web_profile_info/?username=joyca", headers=instaHeadersUA)

    if response.status_code == 200 and responseytSubsCount.status_code == 200:
        #youtubeBanner
        jsonRes  =response.json()
        image = jsonRes["items"][0]["brandingSettings"]["image"]["bannerExternalUrl"]
        bannerModel = bannerYT.objects.get_or_create()
        bannerModel[0].dataURL = image
        bannerModel[0].storeTime = now()
        bannerModel[0].dpURL = "https://unavatar.io/youtube/pannacotech"
        bannerModel[0].ytHandle = "Pannacotech"
        bannerModel[0].ytLink = "https://www.youtube.com/@pannacotech"
        #youtubeSubsCount
        jsonRes =responseytSubsCount.json()
        bannerModel[0].subsCount = format_count(jsonRes["items"][0]["statistics"]["subscriberCount"])
        bannerModel[0].save()
        
        return HttpResponse(f'Status code: {response.status_code}')
    else:
        return HttpResponse(f'Failed to fetch data. Status code: {response.status_code} {responseytSubsCount.status_code}')
    


def fetchInsta(request):
        # gettokenfrom db
        accessToken = instagramAccessToken.objects.all()
        instaGraphAPI = 'https://graph.facebook.com/17841451041881672?fields=business_discovery.username(pannacotech){username,website,name,ig_id,id,profile_picture_url,biography,follows_count,followers_count,media_count,media{id,caption,like_count,comments_count,timestamp,username,media_product_type,media_type,owner,permalink,media_url,children{media_url}}}&access_token='+accessToken[0].accessToken
        response = requests.get(instaGraphAPI)
        if response.status_code==200:
            dataa = response.json()
            data = dataa["business_discovery"]
            instaModel = dpInsta.objects.get_or_create()
            instaModel[0].followerCount = format_count(data["followers_count"])
            instaModel[0].storeTime = now()
            instaModel[0].dataURL = "/static/instagram-pannacotech.jpg"
            instaModel[0].dpURL = "/static/instagram-pannacotech.jpg"
            instaModel[0].instaHandle = "Pannacotech"
            instaModel[0].instaLink = "https://www.instagram.com/pannacotech/"
            download_video(data["profile_picture_url"],"instagram-pannacotech.jpg","static")
            instaModel[0].save()

            for media in data["media"]["data"]:
                instaIsSingle = False
                videoURLInsta = None
                mediaLinks = []
                localMedLinks = []
                IsVideo = False
                instaPostID = media["id"]

                if not "media_url" in media:
                    continue
                if media["media_product_type"] == "REELS" and media["media_type"] == "VIDEO" and "media_url" in media:
                    IsVideo = True
                    instaVideoURL = media['media_url']
                    # instaThumbnailURL = media['media_url']
                if media["media_product_type"] == "FEED" and media["media_type"] == "CAROUSEL_ALBUM" and "media_url" in media:
                    IsVideo = False
                    instaIsSingle = False
                    for imLinks in media["children"]["data"]:
                        mediaLinks.append(imLinks["media_url"])
                elif media["media_product_type"] == "FEED" and media["media_type"] == "IMAGE" and "media_url" in media:
                    IsVideo = False
                    instaIsSingle = True
                    mediaLinks.append(media["media_url"])
                
                postMessage = media["caption"]
                input_datetime = datetime.strptime(media["timestamp"], "%Y-%m-%dT%H:%M:%S%z")
                postedTime = input_datetime.strftime("%Y-%m-%d %H:%M:%S.%U")
                likes = format_count(media["like_count"])

                if not storeData.objects.filter(instaPostID = instaPostID, platform="Instagram").exists():
                    if IsVideo == True:
                        download_video(instaVideoURL,f"{instaPostID}.mp4","static/instagram/videos")
                        videoURLInsta = f"static/instagram/videos/{instaPostID}.mp4"
                    # if instaThumbnailURL != "" and IsVideo:
                    #     download_video(instaThumbnailURL,f'{instaPostID}.jpg',f'static/instagram/thumbnail/{instaPostID}')
                    if mediaLinks != [] or mediaLinks != "":
                        for index,value in enumerate(mediaLinks):
                            if is_image(value):
                                download_video(value,f'{instaPostID}-{index}.jpg',f'static/instagram/media/{instaPostID}')
                                localMedLinks.append(f'{instaPostID}-{index}.jpg')
                            else:
                                download_video(value,f'{instaPostID}-{index}.mp4',f'static/instagram/media/{instaPostID}')
                                localMedLinks.append(f'{instaPostID}-{index}.mp4')
                    storeData.objects.create(
                        instaThumbnailURL = f'{instaPostID}.jpg',
                        instaIsVideo = IsVideo,
                        instaVideoURL = videoURLInsta,
                        instaDesc = postMessage,
                        instaPostID = instaPostID,
                        instaIsSingle = instaIsSingle,
                        instaMediaLinks = localMedLinks,
                        platform = "Instagram",
                        publishDateYT = postedTime,
                        instaLikes = likes,
                        instaPostLink = media["permalink"]
                    )
                else:
                    instaDataa= storeData.objects.filter(instaPostID = instaPostID, platform="Instagram").first()
                    # instaDataa.instaThumbnailURL=instaThumbnailURL
                    instaDataa.instaIsVideo=IsVideo
                    # instaVideoURL = videoURLInsta,
                    instaDataa.instaDesc=postMessage
                    instaDataa.instaPostID=instaPostID
                    instaDataa.instaIsSingle=instaIsSingle
                    # instaDataa.instaMediaLinks=mediaLinks
                    instaDataa.instaLikes=likes
                    instaDataa.instaPostLink = media["permalink"]
                    instaDataa.save()

            return HttpResponse(f'Status code: {response.status_code}')
        else:
            return HttpResponse(f'Failed to fetch data. Status code: {response.status_code}')

def twitterScape(request):
    #Twitter
    scraper = Nitter(log_level=1, skip_instance_check=False)
    joyca_tweets = scraper.get_tweets("pannacotech", mode='user' ,number=30)
    for tweet in joyca_tweets['tweets']:
        dataExist =  storeData.objects.filter(tweetLink = tweet["link"], platform="Twitter").exists()
        if tweet["is-retweet"] == False and not tweet["quoted-post"] and not dataExist:
            isVid = False
            mediaURL = ""
            if tweet["videos"]:
                isVid = True
                # download_video(tweet["videos"][0], f"{extract_twitter_id(tweet["link"])}.mp4", f"static/twitter/videos")
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
                twitterPostID = extract_twitter_id(tweet["link"])
            )
        else:
            twitterDataa = storeData.objects.filter(twitterPostID = extract_twitter_id(tweet["link"]), platform="Twitter").first()
            if twitterDataa:
                twitterDataa.tweetText = tweet["text"]
                twitterDataa.twitterLikes = format_count(tweet["stats"]["likes"])
                twitterDataa.tweetLink = tweet["link"]
                # twitterDataa.twitterIsVideo=isVid
                # twitterDataa.twitterMediaURL=mediaURL
                twitterDataa.save()
    
    
    twitterDetsModel = twitterDP.objects.get_or_create()
    joyca_information = scraper.get_profile_info("pannacotech")
    twitterDetsModel[0].dpURL = joyca_information["image"]
    twitterDetsModel[0].twitterHandle = "Pannacotech"
    twitterDetsModel[0].twitterLink = "https://twitter.com/pannacotech"
    twitterDetsModel[0].followerCount = format_count(joyca_information["stats"]["followers"])
    twitterDetsModel[0].storeTime=now()
    twitterDetsModel[0].save()
    return HttpResponse("Status: OK")