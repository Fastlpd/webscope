#!/usr/bin/env python3
"""Render Nexcartia shot prompts with xAI's asynchronous Grok Imagine Video API."""
import json, os, shutil, subprocess, sys, time, urllib.error, urllib.request
from pathlib import Path
KEY=os.getenv("XAI_API_KEY")
BASE=os.getenv("XAI_API_BASE","https://api.x.ai/v1")
INPUT=Path(os.getenv("NEXCARTIA_SHOT_FILE","nexcartia_video/shorts/SHORT-REX-001/prompts.json"))
OUT=Path(os.getenv("NEXCARTIA_OUTPUT_DIR","rendered/nexcartia"))
MODEL=os.getenv("GROK_VIDEO_MODEL","")
POLL=int(os.getenv("GROK_POLL_SECONDS","5"))
TIMEOUT=int(os.getenv("GROK_TIMEOUT_SECONDS","900"))
def api(url, method="GET", payload=None):
 data=json.dumps(payload).encode() if payload is not None else None
 req=urllib.request.Request(url,data=data,method=method,headers={"Authorization":f"Bearer {KEY}","Content-Type":"application/json","Accept":"application/json"})
 try:
  with urllib.request.urlopen(req,timeout=90) as r: return json.loads(r.read().decode())
 except urllib.error.HTTPError as e:
  raise RuntimeError(f"xAI API HTTP {e.code}: {e.read().decode(errors='replace')[:1000]}") from e
def download(url,path):
 req=urllib.request.Request(url,headers={"User-Agent":"Nexcartia-Grok-Renderer/1.0"})
 with urllib.request.urlopen(req,timeout=180) as src,path.open("wb") as dst: shutil.copyfileobj(src,dst)
def gen(shot,config,i):
 sid=shot.get("id",f"shot-{i:02d}"); dur=int(shot.get("duration",config.get("duration_per_shot",6)))
 if not 1<=dur<=15: raise ValueError(f"{sid}: duration must be 1-15 seconds")
 payload={"model":MODEL or config.get("model","grok-imagine-video-1.5"),"prompt":shot["prompt"],"duration":dur,"aspect_ratio":config.get("aspect_ratio","9:16"),"resolution":os.getenv("GROK_RESOLUTION",config.get("resolution","720p")),"generate_audio":bool(config.get("generate_audio",False))}
 print(f"[{sid}] submitting {dur}s clip")
 job=api(BASE+"/videos/generations","POST",payload); rid=job.get("request_id")
 if not rid: raise RuntimeError(f"{sid}: missing request_id: {job}")
 end=time.time()+TIMEOUT
 while time.time()<end:
  result=api(BASE+"/videos/"+rid); status=result.get("status","").lower()
  if status=="done":
   url=(result.get("video") or {}).get("url")
   if not url: raise RuntimeError(f"{sid}: completed but no video URL: {result}")
   OUT.mkdir(parents=True,exist_ok=True); path=OUT/f"{i:02d}_{sid}.mp4"; download(url,path); print(f"Saved {path}"); return path
  if status=="failed": raise RuntimeError(f"{sid} failed: {result.get('error',result)}")
  print(f"[{sid}] {status or 'pending'}; waiting {POLL}s"); time.sleep(POLL)
 raise TimeoutError(f"{sid} timed out; request_id={rid}")
def stitch(clips,final):
 ff=shutil.which("ffmpeg")
 if not ff: print("ffmpeg unavailable; individual clips retained."); return
 normalized=[]
 for i,p in enumerate(clips,1):
  q=OUT/f"normalized_{i:02d}.mp4"
  subprocess.run([ff,"-y","-i",str(p),"-vf","scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=24,format=yuv420p","-an","-c:v","libx264","-preset","veryfast","-crf","20","-movflags","+faststart",str(q)],check=True)
  normalized.append(q)
 lst=OUT/"clips.txt"; lst.write_text("".join("file '"+p.resolve().as_posix()+"'\n" for p in normalized),encoding="utf-8")
 subprocess.run([ff,"-y","-f","concat","-safe","0","-i",str(lst),"-c","copy","-movflags","+faststart",str(final)],check=True)
 print("Montage created:",final)
def main():
 if not KEY: sys.exit("Missing XAI_API_KEY. Add it in GitHub Settings > Secrets and variables > Actions.")
 if not INPUT.exists(): sys.exit(f"Shot pack not found: {INPUT}")
 cfg=json.loads(INPUT.read_text(encoding="utf-8")); shots=cfg.get("shots",[])
 if not shots: sys.exit("Shot pack has no shots.")
 OUT.mkdir(parents=True,exist_ok=True); clips=[]
 for i,s in enumerate(shots,1): clips.append(gen(s,cfg,i))
 final=OUT/"nexcartia_rex_short_001_rough_montage.mp4"; stitch(clips,final)
 (OUT/"render_manifest.json").write_text(json.dumps({"content_id":cfg.get("content_id"),"model":MODEL or cfg.get("model"),"clips":[str(x) for x in clips],"montage":str(final) if final.exists() else None,"status":"rendered_needs_human_review","published":False},indent=2),encoding="utf-8")
 print("Draft render complete. Review and add licensed sound, voice-over, subtitles and end card before publishing.")
if __name__=="__main__": main()
