'use client';
import { useEffect, useRef } from 'react';

const APP_STYLE = `

  :root{
    --sky-top:#FFDD8A;
    --sky-mid:#FF9F68;
    --sky-pink:#FF6F91;
    --sky-purple:#8A5FBF;
    --sky-deep:#4B3869;
    --sun:#FFC93C;
    --coral:#FF6B5B;
    --turquoise:#0EA5A0;
    --turquoise-dim:#0a7d79;
    --card:#FFF9EF;
    --ink:#2B1B33;
    --ink-soft:rgba(43,27,51,0.6);
    --line:rgba(43,27,51,0.14);
    --ease-out:cubic-bezier(0.16, 1, 0.3, 1);
    --ease-spring:cubic-bezier(0.34, 1.32, 0.64, 1);
  }
  *{box-sizing:border-box;}
  button, .dest-row, .highlight-row, .add-city-row{
    transition:transform .15s var(--ease-out), box-shadow .15s var(--ease-out), background .15s var(--ease-out);
  }
  button:active, .dest-row:active, .add-city-row:active{
    transform:scale(0.96);
  }
  .pin{ transition:transform .15s var(--ease-out); }
  .pin:active .pin-dot-wrap{ transform:scale(0.85); }
  html, body{margin:0; background:#4e4a66;}
  .splash-screen{
    position:fixed;
    inset:0;
    background:#0c2340;
  }
  .splash-img{
    width:100%;
    height:100%;
    display:block;
    object-fit:cover;
  }
  .app{
    position:relative;
    overflow-x:hidden;
    min-height:100vh;
    min-height:100dvh;
    padding:36px 16px 130px;
    font-family:'Poppins', sans-serif;
    color:#fff;
    background:linear-gradient(180deg,
      var(--sky-top) 0%,
      var(--sky-mid) 26%,
      var(--sky-pink) 52%,
      var(--sky-purple) 76%,
      var(--sky-deep) 100%);
  }
  .app::before{
    content:'';
    position:absolute;
    top:-70px;
    left:50%;
    transform:translateX(-50%);
    width:360px;height:260px;
    background:
      radial-gradient(circle at 30% 65%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.95) 30%, transparent 32%),
      radial-gradient(circle at 52% 50%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.95) 36%, transparent 38%),
      radial-gradient(circle at 74% 62%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.92) 28%, transparent 30%),
      radial-gradient(circle at 50% 78%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.92) 34%, transparent 36%);
    filter:blur(2px);
    opacity:0.9;
    pointer-events:none;
    z-index:0;
  }
  .app::after{
    content:'';
    position:absolute;
    inset:0;
    background:
      radial-gradient(ellipse at 15% 85%, rgba(14,165,160,0.28), transparent 45%),
      radial-gradient(ellipse at 90% 92%, rgba(255,107,91,0.22), transparent 40%);
    pointer-events:none;
    z-index:0;
  }
  .app.photo-bg::before,
  .app.photo-bg::after{
    display:none;
  }
  .app.photo-bg{
    background-size:cover;
    background-position:center top;
    background-repeat:no-repeat;
  }
  .bg-overlay{
    position:absolute;
    inset:0;
    background:linear-gradient(180deg, rgba(30,20,40,0.55) 0%, rgba(30,20,40,0.7) 60%, rgba(30,20,40,0.85) 100%);
    z-index:0;
  }
  .wrap{max-width:680px;margin:0 auto;position:relative;z-index:1;}

  .passcode-backdrop{
    position:fixed;
    inset:0;
    background:rgba(20,10,30,0.45);
    backdrop-filter:blur(6px);
    -webkit-backdrop-filter:blur(6px);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px;
    z-index:100;
    animation:fadeIn .18s ease both;
  }
  @keyframes fadeIn{ from{opacity:0;} to{opacity:1;} }
  .passcode-card{
    width:100%;
    max-width:300px;
    background:rgba(255,251,244,0.94);
    backdrop-filter:blur(20px);
    -webkit-backdrop-filter:blur(20px);
    border-radius:20px;
    padding:26px 22px 0;
    text-align:center;
    box-shadow:0 20px 60px rgba(0,0,0,0.4);
    animation:popIn .3s var(--ease-spring) both;
  }
  .passcode-card.shake{ animation:passcodeShake .4s ease; }
  @keyframes passcodeShake{
    10%,90%{ transform:translateX(-1px); }
    20%,80%{ transform:translateX(2px); }
    30%,50%,70%{ transform:translateX(-4px); }
    40%,60%{ transform:translateX(4px); }
  }
  .passcode-icon{ font-size:28px; margin-bottom:8px; }
  .passcode-title{
    font-family:'Fraunces', serif;
    font-size:19px;
    font-weight:700;
    color:var(--ink);
    margin-bottom:4px;
  }
  .passcode-sub{
    font-size:12.5px;
    color:var(--ink-soft);
    margin-bottom:18px;
  }
  .passcode-input{
    width:100%;
    border:1.5px solid var(--line);
    border-radius:12px;
    padding:12px 14px;
    font-size:18px;
    letter-spacing:4px;
    text-align:center;
    outline:none;
    background:rgba(255,255,255,0.7);
    color:var(--ink);
    font-family:'Poppins', sans-serif;
  }
  .passcode-input:focus{ border-color:var(--coral); }
  .passcode-error{
    font-size:12px;
    font-weight:600;
    color:#e14f40;
    height:30px;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .passcode-actions{
    display:flex;
    border-top:1px solid var(--line);
    margin:0 -22px;
  }
  .passcode-btn{
    flex:1;
    border:none;
    background:transparent;
    padding:14px 0;
    font-size:15px;
    font-weight:600;
    cursor:pointer;
    font-family:'Poppins', sans-serif;
  }
  .passcode-cancel{ color:var(--ink-soft); border-right:1px solid var(--line); border-radius:0 0 0 20px; }
  .passcode-ok{ color:var(--coral); border-radius:0 0 20px 0; }
  .passcode-cancel:active, .passcode-ok:active{ background:rgba(43,27,51,0.06); }

  @keyframes fadeSlideUp{
    from{opacity:0; transform:translateY(14px);}
    to{opacity:1; transform:translateY(0);}
  }
  @keyframes fadeSlideRight{
    from{opacity:0; transform:translateX(-16px);}
    to{opacity:1; transform:translateX(0);}
  }
  @keyframes popIn{
    0%{transform:scale(0.85); opacity:0;}
    100%{transform:scale(1); opacity:1;}
  }

  .view{animation:fadeSlideUp .45s var(--ease-out) both;}

  /* header */
  .eyebrow{
    font-size:11px;
    font-weight:600;
    letter-spacing:0.16em;
    color:#fff;
    text-shadow:0 1px 8px rgba(0,0,0,0.15);
    margin-bottom:12px;
    animation:fadeSlideUp .5s var(--ease-out) both;
  }
  h1{
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:clamp(30px,7.5vw,44px);
    line-height:1.06;
    margin:0 0 14px;
    color:#fff;
    text-shadow:0 4px 24px rgba(75,56,105,0.35);
    animation:fadeSlideUp .55s var(--ease-out) both;
    animation-delay:.05s;
  }
  h1 em{
    font-style:italic;
    background:linear-gradient(90deg, var(--sun), var(--coral));
    -webkit-background-clip:text;
    background-clip:text;
    -webkit-text-fill-color:transparent;
  }
  .sub{
    font-size:13.5px;
    line-height:1.6;
    color:rgba(255,255,255,0.92);
    max-width:48ch;
    margin:0 0 26px;
    text-shadow:0 1px 10px rgba(0,0,0,0.1);
    animation:fadeSlideUp .6s var(--ease-out) both;
    animation-delay:.1s;
  }


  /* region tabs */
  .region-tabs{
    display:flex;
    gap:10px;
    margin-bottom:20px;
    animation:fadeSlideUp .6s var(--ease-out) both;
    animation-delay:.12s;
  }
  .region-tab{
    flex:1;
    text-align:center;
    background:rgba(255,255,255,0.16);
    backdrop-filter:blur(6px);
    border:1.5px solid rgba(255,255,255,0.4);
    color:#fff;
    font-family:'Poppins', sans-serif;
    font-weight:600;
    font-size:13px;
    padding:12px 14px;
    border-radius:999px;
    cursor:pointer;
    transition:transform .2s ease, background .2s ease;
  }
  .region-tab:hover{transform:translateY(-1px);}
  .region-tab.active{
    background:linear-gradient(90deg, var(--coral), var(--sun));
    border-color:transparent;
    color:var(--ink);
    box-shadow:0 8px 20px rgba(255,107,91,0.4);
  }

  /* map */
  .map-card{
    position:relative;
    background:linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.08));
    backdrop-filter:blur(10px);
    border:1.5px solid rgba(255,255,255,0.4);
    border-radius:26px;
    padding:18px;
    margin-bottom:18px;
    box-shadow:0 20px 50px rgba(20,10,30,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
    animation:fadeSlideUp .65s var(--ease-out) both;
    animation-delay:.16s;
  }
  .map-stage{
    position:relative;
    width:100%;
    border-radius:18px;
    overflow:hidden;
    background:radial-gradient(circle at 30% 20%, rgba(255,255,255,0.14), transparent 60%);
    box-shadow:0 10px 30px rgba(0,0,0,0.35);
  }
  .map-svg{width:100%;height:100%;display:block;}
  .map-svg path{
    fill:rgba(255,255,255,0.22);
    stroke:rgba(255,255,255,0.75);
    stroke-width:1.6;
  }
  .map-img{
    width:100%;
    height:100%;
    display:block;
    object-fit:cover;
    border-radius:18px;
    filter:saturate(1.08) contrast(1.03);
  }
  .map-stage::after{
    content:'';
    position:absolute;
    inset:0;
    border-radius:18px;
    box-shadow:inset 0 0 40px rgba(20,10,30,0.35);
    pointer-events:none;
  }
  .pin{
    position:absolute;
    width:40px;height:40px;
    transform:translate(-50%,-50%);
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    background:none;
    border:none;
    padding:0;
  }
  .pin-dot-wrap{
    position:relative;
    width:15px;height:15px;
    transition:transform .12s ease;
  }
  .pin-ring{
    position:absolute;
    inset:-3px;
    border-radius:50%;
    background:var(--plan-color, var(--coral));
    opacity:0.25;
    animation:pinPulse 2.2s ease-in-out infinite;
  }
  @keyframes pinPulse{
    0%,100%{ transform:scale(1); opacity:0.25; }
    50%{ transform:scale(1.35); opacity:0.08; }
  }
  .pin-dot{
    position:relative;
    width:15px;height:15px;
    border-radius:50%;
    background:var(--plan-color, var(--coral));
    border:2px solid #fff;
    box-shadow:0 3px 8px rgba(0,0,0,0.35), 0 0 12px var(--plan-color, var(--coral));
  }
  .pin-star{
    position:absolute;
    top:-7px;
    right:-8px;
    font-size:11px;
    filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4));
  }
  .pin-eleny-hidden{ opacity:0.4; }
  .pin-eleny-hidden .pin-dot{ border-style:dashed; }
  .map-stage.placing{ cursor:crosshair; }
  .pin-preview{ cursor:default; animation:popIn .3s var(--ease-spring) both; }
  .pin-preview .pin-dot{ background:#fff; border-color:var(--coral); }
  .add-city-row{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:8px;
    border:1.5px dashed rgba(255,255,255,0.4);
    border-radius:12px;
    padding:11px 13px;
    font-family:'Poppins', sans-serif;
    font-size:12.5px;
    font-weight:600;
    color:rgba(255,255,255,0.85);
    background:none;
    cursor:pointer;
    width:100%;
    margin-bottom:12px;
  }
  .add-city-row:hover{ border-color:#fff; color:#fff; }
  .add-city-form{
    background:rgba(255,255,255,0.16);
    backdrop-filter:blur(8px);
    border:1.5px solid rgba(255,255,255,0.35);
    border-radius:16px;
    padding:16px;
    margin-bottom:16px;
  }
  .add-city-label{
    font-size:10.5px;
    font-weight:700;
    letter-spacing:0.08em;
    color:rgba(255,255,255,0.7);
    margin-bottom:6px;
  }
  .add-city-form input{
    width:100%;
    border:1.5px solid rgba(255,255,255,0.35);
    border-radius:10px;
    padding:9px 12px;
    font-size:16px;
    font-family:'Poppins', sans-serif;
    background:rgba(255,255,255,0.9);
    color:var(--ink);
    margin-bottom:14px;
  }
  .add-city-form input:focus{ outline:none; border-color:var(--coral); }
  .blood-type-select{
    width:100%;
    border:1.5px solid rgba(255,255,255,0.35);
    border-radius:10px;
    padding:9px 12px;
    font-size:16px;
    font-family:'Poppins', sans-serif;
    background:rgba(255,255,255,0.9);
    color:var(--ink);
    margin-bottom:14px;
    -webkit-appearance:none;
    appearance:none;
  }
  .blood-type-select:focus{ outline:none; border-color:var(--coral); }
  .add-city-plans{
    display:flex;
    flex-wrap:wrap;
    gap:8px;
    margin-bottom:16px;
  }
  .add-city-actions{
    display:flex;
    gap:10px;
  }
  .add-city-cancel-btn, .add-city-add-btn{
    flex:1;
    border:none;
    border-radius:999px;
    padding:10px 16px;
    font-family:'Poppins', sans-serif;
    font-weight:700;
    font-size:12.5px;
    cursor:pointer;
  }
  .add-city-cancel-btn{
    background:rgba(255,255,255,0.16);
    color:#fff;
    border:1.5px solid rgba(255,255,255,0.35);
  }
  .add-city-add-btn{
    background:linear-gradient(90deg, var(--coral), var(--sun));
    color:var(--ink);
  }
  .profile-header{
    display:flex;
    align-items:center;
    gap:12px;
    margin-bottom:18px;
    animation:fadeSlideUp .5s var(--ease-out) both;
  }
  .profile-header-flag{
    font-size:34px;
    width:56px;height:56px;
    border-radius:50%;
    background:rgba(255,255,255,0.18);
    border:1.5px solid rgba(255,255,255,0.4);
    display:flex;align-items:center;justify-content:center;
  }
  .profile-header-name{
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:24px;
    color:#fff;
  }
  .profile-info-card{ margin-top:18px; }
  .profile-textarea{
    width:100%;
    min-height:80px;
    border:1.5px solid rgba(255,255,255,0.35);
    border-radius:10px;
    padding:9px 12px;
    font-size:16px;
    font-family:'Poppins', sans-serif;
    background:rgba(255,255,255,0.9);
    color:var(--ink);
    resize:vertical;
  }
  .profile-textarea:focus{ outline:none; border-color:var(--coral); }
  .map-hint{
    font-size:11.5px;
    color:rgba(255,255,255,0.75);
    text-align:center;
    margin-top:10px;
  }
  .legend{
    display:flex;
    flex-wrap:wrap;
    gap:7px 14px;
    justify-content:center;
    margin-top:12px;
  }
  .legend-item{
    display:flex;
    align-items:center;
    gap:5px;
    font-size:10px;
    font-weight:500;
    color:rgba(255,255,255,0.8);
  }
  .legend-swatch{
    width:9px;height:9px;
    border-radius:50%;
    background:var(--plan-color);
    flex:0 0 auto;
  }

  /* intro / profile select */
  .intro-hero{
    width:100%;
    height:230px;
    object-fit:cover;
    border-radius:24px;
    display:block;
    margin-bottom:22px;
    box-shadow:0 20px 45px rgba(75,56,105,0.4);
    animation:fadeSlideUp .55s var(--ease-out) both;
  }
  .profile-select{
    display:flex;
    gap:12px;
    margin-top:22px;
    animation:fadeSlideUp .7s var(--ease-out) both;
    animation-delay:.15s;
  }
  .profile-card{
    flex:1;
    background:rgba(255,255,255,0.16);
    backdrop-filter:blur(8px);
    border:1.5px solid rgba(255,255,255,0.4);
    border-radius:20px;
    padding:22px 14px;
    text-align:center;
    cursor:pointer;
    color:#fff;
    font-family:'Poppins', sans-serif;
    transition:transform .15s ease, background .15s ease;
  }
  .profile-card:hover{transform:translateY(-2px);background:rgba(255,255,255,0.24);}
  .profile-name{font-family:'Fraunces', serif;font-style:italic;font-weight:700;font-size:18px;}
  .profile-hint{font-size:10.5px;color:rgba(255,255,255,0.7);margin-top:4px;}


  .app-title{
    text-align:center;
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:20px;
    color:#fff;
    text-shadow:0 1px 8px rgba(0,0,0,0.2);
    margin-bottom:18px;
    letter-spacing:0.02em;
  }
  .intro-title{
    font-size:29px;
    margin-bottom:24px;
    animation:popIn .5s var(--ease-spring) both;
  }
  .app-title-amp{
    font-family:'Poppins', sans-serif;
    font-style:normal;
    font-weight:600;
  }
  .app-title-icon{
    display:inline-block;
    font-size:1.55em;
    vertical-align:middle;
    margin-left:2px;
    line-height:1;
  }
  .profile-fab{
    position:absolute;
    top:36px;
    right:16px;
    z-index:10;
    width:40px;
    height:40px;
    border-radius:50%;
    border:1.5px solid rgba(255,255,255,0.45);
    background:rgba(255,255,255,0.18);
    backdrop-filter:blur(8px);
    font-size:18px;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    box-shadow:0 8px 18px rgba(20,10,30,0.3);
  }
  .profile-fab:hover{ background:rgba(255,255,255,0.28); }

  .admin-toggle{
    display:block;
    margin:22px auto 0;
    background:none;
    border:none;
    color:rgba(255,255,255,0.4);
    font-family:'Poppins', sans-serif;
    font-size:10.5px;
    cursor:pointer;
    padding:6px 10px;
  }
  .admin-toggle.on{color:rgba(255,255,255,0.85);}

  /* destination list (below map, easier tap target) */
  .dest-list{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:9px;
    margin-bottom:40px;
  }
  .dest-row{
    position:relative;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:space-between;
    gap:8px;
    min-width:0;
    background:linear-gradient(160deg, rgba(255,255,255,0.2), rgba(255,255,255,0.08));
    backdrop-filter:blur(8px);
    border:1.5px solid rgba(255,255,255,0.3);
    border-left:4px solid var(--plan-color, rgba(255,255,255,0.3));
    border-radius:16px;
    padding:12px 14px;
    cursor:pointer;
    box-shadow:0 8px 20px rgba(20,10,30,0.22);
    animation:fadeSlideUp .4s var(--ease-out) both;
    transition:transform .15s ease, background .15s ease, box-shadow .15s ease;
  }
  .dest-row:hover{transform:translateY(-2px);background:linear-gradient(160deg, rgba(255,255,255,0.28), rgba(255,255,255,0.12));box-shadow:0 12px 26px rgba(20,10,30,0.3);}
  .dest-row.is-top-pick{
    background:linear-gradient(160deg, rgba(255,201,60,0.4), rgba(255,159,104,0.18));
    border-color:rgba(255,225,138,0.7);
    border-left-color:#FFC93C;
    box-shadow:0 8px 22px rgba(255,180,60,0.35), 0 8px 20px rgba(20,10,30,0.22);
  }
  .dest-row.is-top-pick:hover{background:linear-gradient(160deg, rgba(255,201,60,0.48), rgba(255,159,104,0.24));}
  .dest-row-left{min-width:0;}
  .dest-row-name{font-size:12.5px;font-weight:600;color:#fff;line-height:1.25;}
  .dest-row-note{font-size:9.5px;color:rgba(255,255,255,0.7);margin-top:1px;}
  .dest-row-right{display:flex;align-items:center;gap:8px;flex:0 0 auto;}
  .dest-row-plan-emoji{font-size:16px;}
  .dest-row-price{font-family:'Fraunces', serif;font-style:italic;font-weight:700;font-size:13.5px;color:var(--sun);}
  .dest-row-heart{font-size:13px;}
  .dest-row.is-eleny-hidden{opacity:0.55;}
  .dest-row.has-vis-toggle{padding-right:34px;}
  .dest-row-visibility{
    position:absolute;
    top:50%;
    right:8px;
    transform:translateY(-50%);
    background:rgba(20,10,30,0.35);
    border:none;
    border-radius:50%;
    width:22px;height:22px;
    flex:0 0 auto;
    font-size:12px;
    line-height:1;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
  }

  /* detail view */
  .back-btn{
    display:inline-flex;
    align-items:center;
    gap:6px;
    background:rgba(255,255,255,0.18);
    backdrop-filter:blur(6px);
    border:1.5px solid rgba(255,255,255,0.4);
    color:#fff;
    font-family:'Poppins', sans-serif;
    font-weight:600;
    font-size:12.5px;
    padding:9px 16px;
    border-radius:999px;
    cursor:pointer;
    margin-bottom:20px;
    transition:transform .15s ease;
    animation:fadeSlideRight .4s var(--ease-out) both;
  }
  .back-btn:hover{transform:translateX(-3px);}

  .detail-card{
    background:var(--card);
    color:var(--ink);
    border-radius:24px;
    overflow:hidden;
    box-shadow:0 28px 60px rgba(75,56,105,0.45), 0 2px 0 rgba(255,255,255,0.5) inset;
    animation:fadeSlideUp .5s var(--ease-out) both;
    animation-delay:.05s;
  }
  .lightbox-backdrop{
    position:fixed;
    inset:0;
    background:rgba(10,5,15,0.92);
    z-index:200;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    padding:24px;
    animation:fadeIn .15s ease both;
  }
  .lightbox-img{
    max-width:100%;
    max-height:70vh;
    object-fit:contain;
    border-radius:12px;
    box-shadow:0 20px 60px rgba(0,0,0,0.5);
  }
  .lightbox-close{
    position:absolute;
    top:16px; right:16px;
    width:38px;height:38px;
    border:none;
    border-radius:50%;
    background:rgba(255,255,255,0.15);
    color:#fff;
    font-size:20px;
    cursor:pointer;
    display:flex;align-items:center;justify-content:center;
  }
  .lightbox-actions{
    display:flex;
    gap:10px;
    margin-top:18px;
    flex-wrap:wrap;
    justify-content:center;
  }
  .lightbox-btn{
    border:none;
    border-radius:999px;
    padding:10px 18px;
    font-family:'Poppins', sans-serif;
    font-weight:600;
    font-size:13.5px;
    cursor:pointer;
    background:rgba(255,255,255,0.14);
    color:#fff;
    text-decoration:none;
    display:inline-flex;
    align-items:center;
  }
  .lightbox-btn:hover{ background:rgba(255,255,255,0.22); }
  .detail-head{
    padding:22px 24px 6px;
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:12px;
  }
  .detail-head-left{
    min-width:0;
    flex:1;
  }
  .detail-city{
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:27px;
    line-height:1.15;
    overflow-wrap:break-word;
  }
  .detail-country{
    font-size:11.5px;
    font-weight:500;
    color:var(--turquoise-dim);
    margin-top:6px;
  }
  .detail-note{
    font-size:12.5px;
    font-style:italic;
    font-family:'Fraunces', serif;
    color:rgba(43,27,51,0.65);
    margin-top:4px;
  }
  .detail-vibe{
    margin:14px 24px 0;
    font-size:13px;
    line-height:1.6;
    color:var(--ink-soft);
  }
  .detail-code{
    font-family:'Fraunces', serif;
    font-weight:700;
    font-size:24px;
    color:var(--plan-color, var(--coral));
    white-space:nowrap;
    flex-shrink:0;
  }
  .detail-plan-chip{
    display:inline-flex;
    align-items:center;
    gap:3px;
    font-size:8px;
    font-weight:600;
    padding:2px 6px;
    border-radius:999px;
    margin-top:4px;
    color:#fff;
    background:var(--plan-color, var(--coral));
  }

  .price-block{
    margin:16px 24px 0;
    padding:16px 18px;
    border-radius:16px;
    background:rgba(14,165,160,0.08);
    border:1.5px dashed rgba(14,165,160,0.35);
  }
  .price-total{
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:26px;
    color:var(--turquoise-dim);
  }
  .price-total-label{font-size:10px;font-weight:700;letter-spacing:0.08em;color:var(--ink-soft);margin-bottom:4px;}
  .price-split{
    display:flex;
    gap:16px;
    margin-top:8px;
    font-size:11.5px;
    color:var(--ink-soft);
  }
  .price-split b{color:var(--ink);}
  .cost-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:10px;
    margin-top:14px;
  }
  .cost-field-label{
    font-size:10px;
    font-weight:700;
    letter-spacing:0.03em;
    color:var(--ink-soft);
    margin-bottom:4px;
  }
  .cost-field input{
    width:100%;
    font-family:'Poppins', sans-serif;
    font-size:16px;
    border:1.5px solid var(--line);
    border-radius:10px;
    padding:9px 10px;
    background:#fff;
    color:var(--ink);
  }
  .cost-field input:focus{ outline:none; border-color:var(--turquoise); }

  .detail-section{padding:20px 24px 4px;}
  .detail-label{
    font-size:10.5px;
    font-weight:700;
    letter-spacing:0.12em;
    color:var(--turquoise-dim);
    margin-bottom:10px;
  }
  .city-tabs{
    display:flex;
    gap:8px;
    margin-bottom:12px;
  }
  .city-tab{
    border:1.5px solid var(--line);
    background:#fff;
    color:var(--ink-soft);
    font-family:'Poppins', sans-serif;
    font-weight:600;
    font-size:11.5px;
    padding:6px 13px;
    border-radius:999px;
    cursor:pointer;
  }
  .city-tab.active{
    background:var(--coral);
    border-color:var(--coral);
    color:#fff;
  }
  .highlights{
    display:flex;
    flex-direction:column;
    gap:8px;
    margin-bottom:8px;
  }
  .highlight-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    background:#fff;
    border:1.5px solid var(--line);
    border-radius:12px;
    padding:10px 14px;
    animation:fadeSlideUp .35s var(--ease-out) both;
  }
  .highlight-name{font-size:12.5px;font-weight:500;flex:1;min-width:0;}
  .highlight-thumb{
    flex:0 0 auto;
    width:36px;height:36px;
    border-radius:9px;
    object-fit:cover;
    cursor:pointer;
    background:rgba(43,27,51,0.08);
  }
  .highlight-thumb-btn{
    flex:0 0 auto;
    width:36px;height:36px;
    border-radius:9px;
    border:1.5px dashed rgba(43,27,51,0.28);
    background:transparent;
    color:rgba(43,27,51,0.4);
    font-size:14px;
    cursor:pointer;
    display:flex;align-items:center;justify-content:center;
  }
  .highlight-thumb-btn:hover{border-color:var(--coral);color:var(--coral);}
  .highlight-thumb-loading{
    flex:0 0 auto;
    width:36px;height:36px;
    border-radius:9px;
    background:linear-gradient(100deg,
      rgba(43,27,51,0.08) 30%,
      rgba(43,27,51,0.18) 50%,
      rgba(43,27,51,0.08) 70%);
    background-size:220% 100%;
    animation:thumbShimmer 1.2s ease-in-out infinite;
  }
  @keyframes thumbShimmer{
    0%{ background-position:120% 0; }
    100%{ background-position:-20% 0; }
  }
  .gallery{
    padding:16px 24px 0;
  }
  .gallery-label{
    font-size:10.5px;
    font-weight:700;
    letter-spacing:0.12em;
    color:var(--turquoise-dim);
    margin-bottom:10px;
  }
  .gallery-scroll{
    display:flex;
    gap:8px;
    overflow-x:auto;
    padding-bottom:2px;
  }
  .gallery-thumb{
    flex:0 0 auto;
    width:84px;
    height:84px;
    border-radius:14px;
    object-fit:cover;
  }
  .highlight-del{
    flex:0 0 auto;
    width:22px;height:22px;
    border:none;
    background:transparent;
    color:rgba(43,27,51,0.32);
    font-size:16px;
    cursor:pointer;
    border-radius:50%;
    transition:color .15s ease, background .15s ease;
  }
  .highlight-del:hover{color:var(--coral);background:rgba(255,107,91,0.1);}
  .highlight-empty{font-size:12px;color:var(--ink-soft);margin-bottom:8px;}

  .add-row{
    display:flex;
    align-items:center;
    gap:8px;
    border:1.5px dashed rgba(43,27,51,0.25);
    border-radius:12px;
    padding:10px 13px;
    font-size:12px;
    font-weight:500;
    color:var(--ink-soft);
    cursor:pointer;
    margin-top:2px;
    margin-bottom:8px;
  }
  .add-row:hover{border-color:var(--coral);color:var(--coral);}
  .add-form{
    display:flex;
    gap:8px;
    margin-top:2px;
    margin-bottom:8px;
  }
  .add-form-stack{
    flex-direction:column;
    align-items:stretch;
  }
  .lodging-link{
    color:var(--turquoise-dim);
    text-decoration:none;
  }
  .lodging-link:hover{ text-decoration:underline; }
  .add-form input{
    flex:1;
    min-width:0;
    font-family:'Poppins', sans-serif;
    font-size:16px;
    border:1.5px solid var(--line);
    border-radius:10px;
    padding:9px 10px;
    background:#fff;
    color:var(--ink);
  }
  .add-form input:focus{outline:none;border-color:var(--turquoise);}
  .add-form button{
    font-family:'Poppins', sans-serif;
    font-size:11.5px;
    font-weight:700;
    border-radius:999px;
    padding:9px 16px;
    cursor:pointer;
    border:none;
    background:linear-gradient(90deg, var(--turquoise), var(--turquoise-dim));
    color:#fff;
  }

  .fav-btn{
    width:100%;
    margin:18px 0 22px;
    padding:15px;
    border:none;
    border-radius:999px;
    background:linear-gradient(90deg, var(--coral), var(--sun));
    color:var(--ink);
    font-family:'Poppins', sans-serif;
    font-weight:700;
    font-size:13.5px;
    cursor:pointer;
    box-shadow:0 10px 26px rgba(255,107,91,0.4);
    transition:transform .15s ease;
  }
  .confirm-btn{
    display:block;
    width:100%;
    border:none;
    border-radius:999px;
    padding:15px;
    background:linear-gradient(90deg, var(--coral), var(--sun));
    color:var(--ink);
    font-family:'Poppins', sans-serif;
    font-weight:700;
    font-size:14px;
    cursor:pointer;
    box-shadow:0 12px 28px rgba(255,107,91,0.4);
  }
  .fav-btn:hover{transform:translateY(-1px);}
  .fav-btn.is-fav{
    background:linear-gradient(90deg, var(--turquoise), var(--turquoise-dim));
    color:#fff;
    box-shadow:0 10px 26px rgba(14,165,160,0.4);
  }
  .fav-btn .heart{display:inline-block;animation:popIn .35s var(--ease-spring);}
  .admin-pick-banner{
    display:inline-block;
    font-size:11px;
    font-weight:700;
    color:#b8860b;
    background:rgba(255,201,60,0.18);
    border-radius:999px;
    padding:3px 10px;
    margin-top:4px;
  }
  .admin-pick-banner.is-top-pick{
    color:var(--ink);
    background:linear-gradient(90deg, #FFE18A, #FFC93C);
    box-shadow:0 4px 14px rgba(255,180,60,0.5);
  }
  .fav-note{
    margin:0 24px 24px;
    font-family:'Fraunces', serif;
    font-style:italic;
    font-size:13.5px;
    color:rgba(43,27,51,0.7);
    text-align:center;
  }
  .delete-city-btn{
    display:block;
    width:calc(100% - 48px);
    margin:0 24px 22px;
    padding:11px;
    border:1.5px solid rgba(225,79,64,0.35);
    border-radius:999px;
    background:none;
    color:#c0392b;
    font-family:'Poppins', sans-serif;
    font-weight:600;
    font-size:12px;
    cursor:pointer;
  }
  .delete-city-btn:hover{ background:rgba(225,79,64,0.08); }
  .move-pin-btn{
    display:block;
    width:calc(100% - 48px);
    margin:0 24px 12px;
    padding:11px;
    border:1.5px solid rgba(14,165,160,0.35);
    border-radius:999px;
    background:none;
    color:var(--turquoise-dim);
    font-family:'Poppins', sans-serif;
    font-weight:600;
    font-size:12px;
    cursor:pointer;
  }
  .move-pin-btn:hover{ background:rgba(14,165,160,0.08); }

  /* cover photos */
  .dest-row.has-cover{
    min-height:78px;
    align-items:flex-end;
    background-size:cover;
    background-position:center;
    border-color:rgba(255,255,255,0.45);
  }
  .dest-row.has-cover .dest-row-name{font-size:13.5px;text-shadow:0 1px 8px rgba(0,0,0,0.6);}
  .dest-row.has-cover .dest-row-note{text-shadow:0 1px 6px rgba(0,0,0,0.6);}
  .detail-cover{
    position:relative;
    height:210px;
    background-size:cover;
    background-position:center;
    cursor:zoom-in;
    animation:fadeIn .4s ease both;
  }
  .detail-cover::after{
    content:'';
    position:absolute;
    inset:auto 0 0 0;
    height:60px;
    background:linear-gradient(180deg, transparent, var(--card));
    pointer-events:none;
  }
  .detail-cover-change{
    position:absolute;
    top:12px; right:12px;
    z-index:1;
    border:none;
    border-radius:999px;
    padding:6px 12px;
    background:rgba(20,10,30,0.5);
    backdrop-filter:blur(6px);
    color:#fff;
    font-family:'Poppins', sans-serif;
    font-size:11.5px;
    font-weight:600;
    cursor:pointer;
  }
  .detail-cover-add{
    display:block;
    width:calc(100% - 48px);
    margin:20px 24px 0;
    padding:22px 12px;
    border:1.5px dashed rgba(43,27,51,0.22);
    border-radius:16px;
    background:rgba(43,27,51,0.03);
    color:var(--ink-soft);
    font-family:'Poppins', sans-serif;
    font-size:13px;
    font-weight:600;
    cursor:pointer;
  }

  /* swipe entry on the map */
  .swipe-cta{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:10px;
    width:100%;
    border:none;
    border-radius:999px;
    padding:15px;
    margin-bottom:10px;
    background:linear-gradient(90deg, var(--sky-pink), var(--sky-purple));
    color:#fff;
    font-family:'Poppins', sans-serif;
    font-weight:700;
    font-size:14.5px;
    cursor:pointer;
    box-shadow:0 12px 28px rgba(255,111,145,0.45);
    animation:fadeSlideUp .5s var(--ease-out) both;
  }
  .swipe-cta-badge{
    font-size:11px;
    font-weight:700;
    padding:3px 9px;
    border-radius:999px;
    background:rgba(255,255,255,0.25);
  }
  .swipe-cta-badge.is-match{
    background:#fff;
    color:var(--sky-pink);
    animation:badgePulse 1.6s ease-in-out infinite;
  }
  @keyframes badgePulse{ 0%,100%{transform:scale(1);} 50%{transform:scale(1.08);} }

  /* swipe view */
  .swipe-view.no-anim, .swipe-view.no-anim .eyebrow, .swipe-view.no-anim h1, .swipe-view.no-anim .sub{animation:none;}
  .swipe-view h1{margin-bottom:6px;}
  .swipe-view .sub{margin-bottom:10px;font-size:12.5px;}
  .swipe-progress{
    text-align:center;
    font-size:11.5px;
    font-weight:600;
    letter-spacing:0.08em;
    color:rgba(255,255,255,0.8);
    margin-bottom:8px;
  }
  .swipe-progress-bar{
    width:100%;
    max-width:380px;
    height:4px;
    margin:0 auto 16px;
    border-radius:999px;
    background:rgba(255,255,255,0.15);
    overflow:hidden;
  }
  .swipe-progress-fill{
    height:100%;
    border-radius:999px;
    background:linear-gradient(90deg, var(--sky-pink), var(--coral));
    box-shadow:0 0 10px rgba(255,107,91,0.6);
    transition:width .4s var(--ease-out);
  }
  .swipe-deck{
    position:relative;
    width:100%;
    max-width:380px;
    height:min(48vh, 470px);
    min-height:300px;
    margin:0 auto;
  }
  .swipe-card{
    position:absolute;
    inset:0;
    border-radius:28px;
    overflow:hidden;
    background:linear-gradient(160deg, var(--plan-color), var(--plan-dim) 60%, #2B1B33);
    background-size:cover;
    background-position:center;
    box-shadow:0 26px 50px rgba(20,10,30,0.45), 0 0 0 1px rgba(255,255,255,0.09) inset;
    user-select:none;
    -webkit-user-select:none;
    touch-action:pan-y;
    will-change:transform;
    transition:transform .35s var(--ease-out), filter .35s var(--ease-out);
  }
  .swipe-card.no-cover{background-image:radial-gradient(120% 90% at 50% -10%, rgba(255,255,255,0.22), transparent 60%), linear-gradient(160deg, var(--plan-color), var(--plan-dim) 60%, #2B1B33) !important;}
  .swipe-card.is-top{cursor:grab;animation:cardRise .35s var(--ease-out) both;z-index:3;}
  .swipe-card.is-top:active{cursor:grabbing;}
  .swipe-card.is-next{transform:scale(0.93) translate(18px, 8px) rotate(4deg);filter:brightness(0.82);z-index:2;}
  .swipe-card.is-back{transform:scale(0.86) translate(-22px, 16px) rotate(-5deg);filter:brightness(0.6);z-index:1;}
  @keyframes cardRise{ from{transform:scale(0.94) translateY(14px);} to{transform:none;} }
  .swipe-card::after{
    content:'';
    position:absolute;
    inset:0;
    background:linear-gradient(180deg, rgba(20,10,30,0) 30%, rgba(20,10,30,0.5) 68%, rgba(20,10,30,0.92) 100%);
    pointer-events:none;
  }
  .swipe-card-emoji{
    position:absolute;
    top:22%;
    left:0; right:0;
    text-align:center;
    font-size:110px;
    opacity:0.5;
    filter:drop-shadow(0 10px 30px rgba(0,0,0,0.3));
  }
  .swipe-card-info{
    position:absolute;
    left:0; right:0; bottom:0;
    z-index:1;
    padding:22px 22px 24px;
    color:#fff;
  }
  .swipe-card-meta{
    display:flex;
    align-items:center;
    gap:6px;
    font-size:11.5px;
    font-weight:700;
    letter-spacing:0.04em;
    text-transform:uppercase;
    opacity:0.95;
    margin-bottom:6px;
  }
  .swipe-card-meta::before{
    content:'';
    width:7px; height:7px;
    border-radius:50%;
    background:#fff;
    box-shadow:0 0 8px rgba(255,255,255,0.8);
  }
  .swipe-card-city{
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:38px;
    line-height:1.05;
    text-shadow:0 2px 18px rgba(0,0,0,0.45);
  }
  .swipe-card-vibe{
    font-size:12.5px;
    line-height:1.5;
    margin-top:9px;
    opacity:0.92;
    display:-webkit-box;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
    overflow:hidden;
  }
  .swipe-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px;}
  .swipe-chip{
    font-size:11px;
    font-weight:700;
    padding:5px 12px;
    border-radius:999px;
    background:rgba(255,255,255,0.14);
    border:1px solid rgba(255,255,255,0.28);
    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);
  }
  .swipe-stamp{
    position:absolute;
    top:28px;
    z-index:2;
    padding:7px 16px;
    border:3.5px solid currentColor;
    border-radius:12px;
    font-family:'Poppins', sans-serif;
    font-weight:800;
    font-size:26px;
    letter-spacing:0.06em;
    opacity:0;
    pointer-events:none;
    text-shadow:0 2px 12px rgba(0,0,0,0.25);
    box-shadow:0 0 24px -4px currentColor;
  }
  .stamp-like{left:22px;color:#5CE1A0;transform:rotate(-14deg);}
  .stamp-nope{right:22px;color:#FF6B7A;transform:rotate(14deg);}
  .swipe-actions{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:22px;
    margin:18px 0 30px;
  }
  .swipe-btn{
    border:none;
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    font-family:'Poppins', sans-serif;
    font-weight:700;
    background:#fff;
    box-shadow:0 12px 26px rgba(20,10,30,0.35);
    transition:transform .15s var(--ease-spring), box-shadow .15s ease;
  }
  .swipe-btn:active{transform:scale(0.88);}
  .swipe-btn-nope, .swipe-btn-like{width:68px;height:68px;font-size:28px;}
  .swipe-btn-nope{color:#FF5A6E;box-shadow:0 12px 26px rgba(255,90,110,0.3);}
  .swipe-btn-like{color:#fff;background:linear-gradient(135deg, var(--sky-pink), var(--coral));box-shadow:0 12px 26px rgba(255,107,91,0.45);}
  .swipe-btn-info{
    width:46px;height:46px;
    font-size:18px;
    font-family:'Fraunces', serif;
    font-style:italic;
    color:var(--sky-purple);
  }
  .swipe-done{
    text-align:center;
    padding:34px 20px;
    border-radius:24px;
    background:rgba(255,255,255,0.14);
    backdrop-filter:blur(10px);
    border:1.5px solid rgba(255,255,255,0.3);
    margin-bottom:26px;
  }
  .swipe-done-emoji{font-size:52px;animation:popIn .5s var(--ease-spring) both;}
  .swipe-done-title{font-family:'Fraunces', serif;font-style:italic;font-weight:700;font-size:26px;margin-top:6px;}
  .swipe-done-sub{font-size:13px;opacity:0.9;margin:6px 0 16px;}
  .swipe-matches{margin-bottom:40px;}
  .swipe-matches-label{font-size:11px;font-weight:700;letter-spacing:0.16em;margin-bottom:10px;}
  .swipe-matches-empty{font-size:13px;opacity:0.8;}
  .swipe-matches-row{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px;scrollbar-width:none;}
  .match-chip{
    position:relative;
    flex:0 0 auto;
    width:118px;
    height:150px;
    border:2px solid rgba(255,255,255,0.7);
    border-radius:18px;
    overflow:hidden;
    background:linear-gradient(160deg, var(--plan-color), var(--plan-dim));
    background-size:cover;
    background-position:center;
    cursor:pointer;
    box-shadow:0 10px 22px rgba(20,10,30,0.3);
    display:flex;
    align-items:flex-end;
    padding:0;
  }
  .match-chip::after{
    content:'';
    position:absolute;
    inset:0;
    background:linear-gradient(180deg, transparent 40%, rgba(20,10,30,0.8));
  }
  .match-chip-city{
    position:relative;
    z-index:1;
    padding:10px;
    color:#fff;
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:15px;
    text-align:left;
    line-height:1.1;
  }

  /* same-screen redraws: no entrance animations (see render). Blanket rule —
     anything rebuilt in place (a toggled reaction, an opened form, a new
     highlight, etc.) should just appear, not pop/fade in like a fresh screen. */
  .app.is-redraw .view,
  .app.is-redraw .view *{animation:none !important;}

  /* avatar badges (flag initials — no 3D) */
  .avatar-thumb{background-size:cover;background-position:center 30%;display:flex;align-items:center;justify-content:center;}
  .profile-card .avatar-thumb{width:96px;height:96px;border-radius:50%;margin:0 auto 10px;font-size:34px;}
  .profile-fab{padding:0;overflow:hidden;}
  .fab-thumb{width:100%;height:100%;border-radius:50%;font-size:18px;}
  .avatar-duo{display:flex;justify-content:center;gap:14px;margin:0 0 10px;}
  .avatar-duo .avatar-thumb{width:84px;height:84px;border-radius:50%;font-size:30px;}
  .match-box .match-photo{height:170px;}
  .reveal-duo{display:flex;justify-content:center;gap:14px;height:0;opacity:0;overflow:hidden;transition:height .6s var(--ease-out), opacity .6s ease;}
  .reveal-backdrop.revealed .reveal-duo{height:84px;opacity:1;}
  .reveal-duo .avatar-thumb{width:84px;height:84px;border-radius:50%;font-size:30px;}
  .activity-emoji.has-avatar{position:relative;overflow:visible;font-size:15px;}

  /* flight routes & home bases */
  .route-layer{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:visible;}
  .route-glow{
    fill:none;
    stroke:var(--route-color);
    stroke-linecap:round;
    opacity:0.75;
    filter:drop-shadow(0 0 4px var(--route-color));
  }
  .map-intro .route-glow{
    stroke-dasharray:1;
    stroke-dashoffset:1;
    animation:routeDraw 1.1s var(--ease-out) forwards;
  }
  .route-dash{
    fill:none;
    stroke:#fff;
    stroke-linecap:round;
    opacity:0.95;
    animation:routeMarch 1.4s linear infinite;
  }
  .map-intro .route-dash{opacity:0;animation:routeFade .5s ease forwards, routeMarch 1.4s linear infinite;}
  .route-shade{fill:none;stroke:rgba(20,10,30,0.45);stroke-linecap:round;opacity:0.95;}
  .map-intro .route-shade{opacity:0;animation:routeFade .5s ease forwards;}
  @keyframes routeDraw{ to{stroke-dashoffset:0;} }
  @keyframes routeFade{ to{opacity:0.95;} }
  @keyframes routeMarch{ to{stroke-dashoffset:calc(var(--dash-cycle, 17) * -1px);} }
  .route-plane path{fill:#fff;stroke:var(--route-color);stroke-width:1.2;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));}
  .home-pin{
    position:absolute;
    z-index:2;
    width:30px;height:30px;
    transform:translate(-50%,-50%);
    pointer-events:none;
  }
  .map-intro .home-pin{animation:popIn .5s var(--ease-spring) .2s both;}
  .home-pin-flag{
    position:relative;
    width:30px;height:30px;
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:16px;
    background:#fff;
    border:2.5px solid var(--route-color);
    box-shadow:0 4px 10px rgba(0,0,0,0.35);
  }
  .home-pin-pulse{
    position:absolute;
    inset:-6px;
    border-radius:50%;
    background:var(--route-color);
    opacity:0.35;
    animation:homePulse 2s ease-out infinite;
  }
  @keyframes homePulse{ 0%{transform:scale(0.6);opacity:0.5;} 100%{transform:scale(1.7);opacity:0;} }
  .home-chip{
    display:block;
    margin:10px auto 0;
    border:1px solid rgba(255,255,255,0.35);
    border-radius:999px;
    padding:6px 14px;
    background:rgba(255,255,255,0.12);
    color:#fff;
    font-family:'Poppins', sans-serif;
    font-size:11.5px;
    font-weight:600;
    cursor:pointer;
  }
  .home-chip.is-cancel{background:rgba(255,107,91,0.4);}
  .pin, .pin-preview{z-index:3;}
  .map-intro .pin-dot-wrap{animation:pinDrop .65s var(--ease-spring) backwards;}
  @keyframes pinDrop{
    0%{transform:translateY(-34px) scale(0.5);opacity:0;}
    60%{transform:translateY(3px) scale(1.08);opacity:1;}
    80%{transform:translateY(-2px) scale(0.98);}
    100%{transform:none;}
  }

  /* activity feed */
  .activity-card{
    margin-bottom:16px;
    border-radius:20px;
    background:rgba(20,10,30,0.32);
    backdrop-filter:blur(12px);
    border:1px solid rgba(255,255,255,0.22);
    overflow:hidden;
    animation:fadeSlideUp .5s var(--ease-out) both;
  }
  .activity-head{
    display:flex;
    align-items:center;
    gap:8px;
    width:100%;
    padding:12px 16px 4px;
    border:none;
    background:none;
    color:#fff;
    font-family:'Poppins', sans-serif;
    cursor:pointer;
  }
  .activity-title{font-size:11px;font-weight:700;letter-spacing:0.14em;}
  .activity-badge{
    font-size:10.5px;
    font-weight:700;
    padding:2px 8px;
    border-radius:999px;
    background:var(--sky-pink);
    animation:badgePulse 1.6s ease-in-out infinite;
  }
  .activity-chevron{margin-left:auto;font-size:16px;opacity:0.8;transition:transform .3s var(--ease-out);}
  .activity-card.open .activity-chevron{transform:rotate(180deg);}
  .activity-list{padding:4px 8px 8px;}
  .activity-item{
    display:flex;
    align-items:center;
    gap:10px;
    padding:8px;
    border-radius:14px;
    animation:fadeSlideRight .35s var(--ease-out) both;
  }
  .activity-card.open .activity-item:nth-child(2){animation-delay:.04s;}
  .activity-card.open .activity-item:nth-child(3){animation-delay:.08s;}
  .activity-card.open .activity-item:nth-child(4){animation-delay:.12s;}
  .activity-card.open .activity-item:nth-child(n+5){animation-delay:.16s;}
  .activity-item.is-link{cursor:pointer;}
  .activity-item.is-link:active{background:rgba(255,255,255,0.1);}
  .activity-emoji{
    flex:0 0 auto;
    width:34px;height:34px;
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:17px;
    background:rgba(255,255,255,0.14);
  }
  .activity-body{min-width:0;flex:1;}
  .activity-text{font-size:12.5px;line-height:1.35;}
  .activity-time{font-size:10.5px;opacity:0.65;margin-top:1px;}

  /* weather */
  .dest-row-weather{font-size:10.5px;color:rgba(255,255,255,0.85);margin-top:2px;min-height:14px;transition:opacity .4s ease;}
  .dest-row-weather.is-empty{opacity:0;}
  .dest-row.has-cover .dest-row-weather{text-shadow:0 1px 6px rgba(0,0,0,0.6);}
  .detail-weather{font-size:12px;font-weight:600;color:var(--ink-soft);margin:4px 0 2px;min-height:16px;transition:opacity .4s ease;}
  .detail-weather.is-empty{opacity:0;}
  .swipe-weather{
    position:absolute;
    top:16px; right:16px;
    z-index:2;
    padding:6px 13px;
    border-radius:999px;
    background:rgba(20,10,30,0.4);
    border:1px solid rgba(255,255,255,0.18);
    backdrop-filter:blur(10px);
    -webkit-backdrop-filter:blur(10px);
    color:#fff;
    font-size:12.5px;
    font-weight:700;
    box-shadow:0 6px 16px rgba(20,10,30,0.3);
    transition:opacity .4s ease;
  }
  .swipe-weather.is-empty{opacity:0;}

  /* holographic shine on swipe cards */
  .swipe-shine{
    position:absolute;
    inset:0;
    z-index:1;
    pointer-events:none;
    opacity:var(--shine-o, 0);
    background:linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.55) calc(var(--shine-x, 50%) - 8%), rgba(255,190,240,0.35) var(--shine-x, 50%), rgba(150,235,255,0.35) calc(var(--shine-x, 50%) + 6%), transparent 80%);
    mix-blend-mode:soft-light;
    transition:opacity .3s ease;
  }
  .swipe-card.is-top::before{
    content:'';
    position:absolute;
    inset:0;
    z-index:1;
    pointer-events:none;
    background:linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.28) 48%, rgba(255,220,250,0.18) 52%, transparent 65%);
    background-size:250% 100%;
    background-position:150% 0;
    animation:sheen 5.5s ease-in-out 1.2s infinite;
  }
  @keyframes sheen{ 0%{background-position:150% 0;} 30%,100%{background-position:-60% 0;} }
  .swipe-card-info, .swipe-stamp{z-index:2;}

  /* sky */
  .sky-dawn .bg-overlay{background:linear-gradient(180deg, rgba(255,140,120,0.32) 0%, rgba(90,40,90,0.62) 55%, rgba(30,20,40,0.85) 100%);}
  .sky-day .bg-overlay{background:linear-gradient(180deg, rgba(60,110,170,0.28) 0%, rgba(40,35,70,0.62) 55%, rgba(30,20,40,0.85) 100%);}
  .sky-night .bg-overlay{background:linear-gradient(180deg, rgba(10,12,40,0.78) 0%, rgba(12,8,30,0.85) 60%, rgba(8,5,20,0.93) 100%);}
  .sky-fx{position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden;}
  .cloud{
    position:absolute;
    left:0;
    width:280px;height:90px;
    border-radius:50%;
    background:radial-gradient(ellipse at 50% 60%, rgba(255,255,255,0.28), rgba(255,255,255,0.08) 55%, transparent 72%);
    filter:blur(6px);
    animation-name:cloudDrift;
    animation-timing-function:linear;
    animation-iteration-count:infinite;
  }
  .sky-night .cloud{opacity:0.35;}
  @keyframes cloudDrift{ from{translate:-320px 0;} to{translate:calc(100vw + 60px) 0;} }
  .stars{
    position:absolute;
    inset:0;
    background-image:
      radial-gradient(1.5px 1.5px at 12% 8%, #fff, transparent),
      radial-gradient(1px 1px at 28% 22%, #fff, transparent),
      radial-gradient(1.5px 1.5px at 47% 12%, #fff, transparent),
      radial-gradient(1px 1px at 63% 30%, #fff, transparent),
      radial-gradient(2px 2px at 81% 9%, #fff, transparent),
      radial-gradient(1px 1px at 91% 38%, #fff, transparent),
      radial-gradient(1.5px 1.5px at 7% 45%, #fff, transparent),
      radial-gradient(1px 1px at 35% 52%, #fff, transparent),
      radial-gradient(1.5px 1.5px at 72% 58%, #fff, transparent),
      radial-gradient(1px 1px at 55% 70%, #fff, transparent),
      radial-gradient(1.5px 1.5px at 18% 78%, #fff, transparent),
      radial-gradient(1px 1px at 88% 82%, #fff, transparent);
    animation:twinkle 3.5s ease-in-out infinite alternate;
  }
  .stars-b{transform:translate(4%, 6%) scale(1.1);animation-duration:5s;animation-delay:-2s;}
  @keyframes twinkle{ from{opacity:0.25;} to{opacity:0.9;} }

  /* skeleton hero while photos load */
  .detail-cover.skeleton{
    cursor:default;
    background:linear-gradient(100deg, rgba(43,27,51,0.06) 30%, rgba(43,27,51,0.14) 50%, rgba(43,27,51,0.06) 70%);
    background-size:220% 100%;
    animation:thumbShimmer 1.2s ease-in-out infinite;
  }

  /* pull to refresh */
  .ptr{
    position:fixed;
    top:0; left:50%;
    z-index:400;
    width:44px;height:44px;
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    background:#fff;
    box-shadow:0 8px 22px rgba(20,10,30,0.35);
    font-size:20px;
    pointer-events:none;
  }
  .ptr.ready{box-shadow:0 8px 22px rgba(255,111,145,0.6);}
  .ptr.spinning{transition:transform .3s var(--ease-out);transform:translate(-50%, 28px) !important;}
  .ptr.spinning .ptr-plane{display:inline-block;animation:ptrSpin .8s linear infinite;}
  .ptr.done{transition:transform .35s ease-in, opacity .35s ease;transform:translate(-50%, -60px) !important;opacity:0;}
  @keyframes ptrSpin{ to{transform:rotate(360deg);} }

  /* availability calendar */
  .avail-hint{font-size:12px;color:rgba(255,255,255,0.8);margin:-2px 0 12px;line-height:1.45;}
  .cal-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
  .cal-month{font-family:'Fraunces', serif;font-style:italic;font-weight:700;font-size:18px;}
  .cal-arrow{
    width:34px;height:34px;
    border:none;
    border-radius:50%;
    background:rgba(255,255,255,0.18);
    color:#fff;
    font-size:20px;
    line-height:1;
    cursor:pointer;
  }
  .cal-arrow:disabled{opacity:0.3;cursor:default;}
  .cal-grid{
    display:grid;
    grid-template-columns:repeat(7, 1fr);
    gap:4px;
    touch-action:none;
    user-select:none;
    -webkit-user-select:none;
  }
  .cal-dow{text-align:center;font-size:10.5px;font-weight:700;opacity:0.7;padding-bottom:2px;}
  .cal-day{
    position:relative;
    aspect-ratio:1;
    display:flex;
    align-items:center;
    justify-content:center;
    border-radius:12px;
    font-size:13px;
    font-weight:600;
    background:rgba(255,255,255,0.1);
    cursor:pointer;
    transition:background .15s ease, transform .15s var(--ease-spring);
  }
  .cal-day.is-past{opacity:0.3;cursor:default;}
  .cal-day.is-today{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,0.7);}
  .cal-day.is-mine{background:var(--turquoise);color:#fff;transform:scale(0.94);}
  .cal-day.is-theirs::after{
    content:'';
    position:absolute;
    bottom:4px;
    width:6px;height:6px;
    border-radius:50%;
    background:var(--sun);
    box-shadow:0 0 0 1.5px rgba(20,10,30,0.25);
  }
  .cal-day.is-both{background:linear-gradient(135deg, var(--sky-pink), var(--coral));color:#fff;box-shadow:0 4px 12px rgba(255,111,145,0.5);}
  .cal-day.is-both::after{background:#fff;}
  .cal-day.is-trip{outline:2px solid #fff;outline-offset:-2px;}
  .cal-legend{display:flex;flex-wrap:wrap;gap:12px;margin:12px 0 4px;font-size:11px;font-weight:600;}
  .cal-key{display:inline-flex;align-items:center;gap:5px;}
  .cal-key::before{content:'';width:12px;height:12px;border-radius:4px;}
  .key-mine::before{background:var(--turquoise);}
  .key-theirs::before{width:7px;height:7px;border-radius:50%;background:var(--sun);}
  .key-both::before{background:linear-gradient(135deg, var(--sky-pink), var(--coral));}
  .key-trip::before{border:2px solid #fff;box-sizing:border-box;}
  .avail-windows{margin-top:12px;}
  .avail-windows-title{font-size:11px;font-weight:700;letter-spacing:0.12em;margin-bottom:8px;}
  .avail-window{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    padding:10px 12px;
    margin-bottom:8px;
    border-radius:14px;
    background:rgba(255,255,255,0.14);
    border:1px solid rgba(255,111,145,0.45);
  }
  .avail-window-dates{font-weight:700;font-size:14px;}
  .avail-window-len{font-size:11px;opacity:0.8;}
  .avail-use{
    flex:0 0 auto;
    border:none;
    border-radius:999px;
    padding:8px 14px;
    background:#fff;
    color:var(--ink);
    font-family:'Poppins', sans-serif;
    font-weight:700;
    font-size:12px;
    cursor:pointer;
  }
  .avail-use.is-set{background:rgba(255,255,255,0.25);color:#fff;cursor:default;}
  .avail-empty{font-size:12.5px;opacity:0.85;line-height:1.45;}
  .avail-clear{
    margin-top:10px;
    border:none;
    background:none;
    color:rgba(255,255,255,0.7);
    font-family:'Poppins', sans-serif;
    font-size:12px;
    text-decoration:underline;
    cursor:pointer;
    padding:0;
  }
  .avail-nudge{
    display:block;
    width:100%;
    text-align:left;
    border:1.5px solid rgba(255,255,255,0.35);
    border-radius:18px;
    padding:12px 16px;
    margin-bottom:12px;
    background:rgba(14,165,160,0.35);
    backdrop-filter:blur(10px);
    color:#fff;
    font-family:'Poppins', sans-serif;
    font-weight:600;
    font-size:13px;
    cursor:pointer;
    animation:fadeSlideUp .5s var(--ease-out) both;
  }

  /* countdown */
  .countdown-card{
    display:flex;
    align-items:center;
    gap:14px;
    width:100%;
    text-align:left;
    border:1.5px solid rgba(255,255,255,0.4);
    border-radius:22px;
    padding:14px 18px;
    margin-bottom:12px;
    background:linear-gradient(135deg, rgba(255,255,255,0.26), rgba(255,255,255,0.08));
    backdrop-filter:blur(12px);
    color:#fff;
    font-family:'Poppins', sans-serif;
    cursor:pointer;
    box-shadow:0 14px 30px rgba(20,10,30,0.22);
    animation:fadeSlideUp .5s var(--ease-out) both;
  }
  .countdown-big{
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:46px;
    line-height:1;
    min-width:58px;
    text-align:center;
    background:linear-gradient(180deg, #fff, var(--sun));
    -webkit-background-clip:text;
    background-clip:text;
    -webkit-text-fill-color:transparent;
    filter:drop-shadow(0 4px 12px rgba(255,201,60,0.4));
  }
  .countdown-label{font-weight:700;font-size:14.5px;line-height:1.25;}
  .countdown-sub{font-size:11.5px;opacity:0.85;margin-top:2px;}

  /* notifications */
  .push-banner{
    display:flex;
    align-items:center;
    gap:10px;
    padding:10px 10px 10px 16px;
    margin-bottom:12px;
    border-radius:18px;
    background:rgba(20,10,30,0.35);
    backdrop-filter:blur(10px);
    border:1px solid rgba(255,255,255,0.2);
    animation:fadeSlideUp .5s var(--ease-out) both;
  }
  .push-banner-text{flex:1;font-size:12px;font-weight:500;line-height:1.35;}
  .push-banner-on{
    flex:0 0 auto;
    border:none;
    border-radius:999px;
    padding:8px 14px;
    background:#fff;
    color:var(--ink);
    font-family:'Poppins', sans-serif;
    font-weight:700;
    font-size:12px;
    cursor:pointer;
  }
  .push-banner-x{flex:0 0 auto;border:none;background:none;color:rgba(255,255,255,0.7);font-size:20px;cursor:pointer;padding:0 4px;}
  .notif-status{font-size:12.5px;line-height:1.5;color:var(--ink-soft);}
  .notif-status.is-on{color:var(--turquoise-dim);font-weight:600;}
  .trip-dates{display:flex;gap:10px;}
  .trip-date{flex:1;min-width:0;display:flex;flex-direction:column;}
  .trip-date input{
    width:100%;
    min-width:0;
    min-height:42px;
    -webkit-appearance:none;
    appearance:none;
  }
  .trip-dates-hint{font-size:11.5px;color:var(--ink-soft);margin-top:8px;}

  /* winner */
  .winner-cta{
    display:flex;
    flex-direction:column;
    align-items:center;
    width:100%;
    border:none;
    border-radius:22px;
    padding:14px;
    margin-bottom:18px;
    background:linear-gradient(90deg, #FFE18A, #FFC93C, #FF9F68);
    color:var(--ink);
    font-family:'Poppins', sans-serif;
    font-weight:800;
    font-size:15px;
    cursor:pointer;
    box-shadow:0 14px 32px rgba(255,180,60,0.5);
    animation:popIn .5s var(--ease-spring) both;
  }
  .winner-cta-sub{font-size:11px;font-weight:600;opacity:0.7;margin-top:2px;}

  /* reveal */
  .reveal-backdrop{
    position:fixed;
    inset:0;
    z-index:320;
    overflow-y:auto;
    overflow-x:hidden;
    font-family:'Poppins', sans-serif;
    color:#fff;
    background:
      radial-gradient(circle at 20% 15%, rgba(255,255,255,0.18) 0 1px, transparent 2px),
      radial-gradient(circle at 70% 25%, rgba(255,255,255,0.14) 0 1px, transparent 2px),
      radial-gradient(circle at 40% 60%, rgba(255,255,255,0.12) 0 1px, transparent 2px),
      radial-gradient(circle at 50% 0%, #4B3869, #1a1030 70%);
    animation:fadeIn .35s ease both;
  }
  .reveal-stage{
    position:relative;
    max-width:380px;
    margin:0 auto;
    padding:48px 16px 40px;
    text-align:center;
  }
  .reveal-kicker{font-size:12px;font-weight:700;letter-spacing:0.28em;opacity:0.85;margin-bottom:18px;animation:fadeSlideUp .6s var(--ease-out) both;}
  .boarding-pass{
    position:relative;
    text-align:left;
    color:var(--ink);
    background:var(--card);
    border-radius:22px;
    overflow:hidden;
    box-shadow:0 30px 70px rgba(0,0,0,0.5);
    animation:passIn .7s var(--ease-spring) both;
  }
  @keyframes passIn{ from{transform:translateY(60px) rotate(-4deg);opacity:0;} to{transform:none;opacity:1;} }
  .bp-top{
    display:flex;
    justify-content:space-between;
    padding:12px 18px;
    background:var(--plan-color, var(--coral));
    color:#fff;
    font-size:10.5px;
    font-weight:800;
    letter-spacing:0.14em;
  }
  .bp-body{padding:16px 18px 18px;}
  .bp-route{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin-bottom:14px;}
  .bp-plane{font-size:22px;color:var(--plan-color, var(--coral));padding-bottom:6px;}
  .bp-to{text-align:right;}
  .bp-label{font-size:9.5px;font-weight:700;letter-spacing:0.14em;color:var(--ink-soft);margin-bottom:4px;}
  .bp-value{font-size:13px;font-weight:700;}
  .bp-meta{
    display:flex;
    justify-content:space-between;
    gap:10px;
    margin-top:16px;
    padding-top:14px;
    border-top:2px dashed rgba(43,27,51,0.18);
  }
  .bp-seat .bp-value{font-size:16px;}
  .flap-text{display:flex;flex-wrap:wrap;gap:4px 10px;}
  .flap-code{justify-content:flex-end;}
  .flap-word{display:inline-flex;gap:3px;}
  .flap-cell{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    min-width:0.78em;
    height:1.32em;
    padding:0 0.08em;
    border-radius:5px;
    background:linear-gradient(180deg, #2B1B33 50%, #22152a 50%);
    color:#FFE18A;
    font-family:'Poppins', sans-serif;
    font-weight:700;
    box-shadow:inset 0 -1px 0 rgba(255,255,255,0.08), 0 2px 4px rgba(0,0,0,0.25);
  }
  .flap-cell.settled{color:#fff;}
  .flap-code .flap-cell{font-size:24px;}
  .flap-city .flap-cell{font-size:21px;}
  .bp-stamp{
    position:absolute;
    right:22px;
    bottom:58px;
    padding:4px 10px;
    border:3px solid #1f9d63;
    border-radius:8px;
    color:#1f9d63;
    font-weight:800;
    font-size:15px;
    letter-spacing:0.12em;
    opacity:0;
    transform:rotate(-12deg) scale(1.8);
    pointer-events:none;
  }
  .boarding-pass.confirmed .bp-stamp{animation:stampIn .45s var(--ease-spring) forwards;}
  @keyframes stampIn{ to{opacity:0.9;transform:rotate(-12deg) scale(1);} }
  .reveal-photo{
    position:relative;
    height:0;
    opacity:0;
    margin-top:18px;
    border-radius:22px;
    overflow:hidden;
    border:3px solid #fff;
    background:linear-gradient(160deg, var(--plan-color), var(--plan-dim));
    background-size:cover;
    background-position:center;
    transition:height .6s var(--ease-out), opacity .6s ease;
  }
  .reveal-backdrop.revealed .reveal-photo{height:200px;opacity:1;}
  .reveal-actions{opacity:0;transform:translateY(10px);transition:opacity .5s ease .3s, transform .5s var(--ease-out) .3s;margin-top:20px;}
  .reveal-backdrop.revealed .reveal-actions{opacity:1;transform:none;}
  .reveal-backdrop .confetti-bit{position:fixed;}

  /* reactions */
  .rx-hint{font-size:11px;color:var(--ink-soft);margin:-4px 0 10px;}
  .rx{position:relative;display:flex;align-items:center;gap:4px;flex:0 0 auto;}
  .rx-partner{
    font-size:12px;
    padding:3px 6px;
    border-radius:999px;
    background:rgba(43,27,51,0.06);
    white-space:nowrap;
  }
  .rx-mine{
    width:30px;height:30px;
    border-radius:50%;
    border:1.5px dashed rgba(43,27,51,0.25);
    background:transparent;
    color:rgba(43,27,51,0.45);
    font-size:15px;
    line-height:1;
    cursor:pointer;
    padding:0;
  }
  .rx-mine.has{border:1.5px solid transparent;background:rgba(255,111,145,0.12);color:inherit;animation:popIn .3s var(--ease-spring) both;}
  .rx-picker{
    position:absolute;
    right:0;
    bottom:calc(100% + 6px);
    z-index:5;
    display:flex;
    gap:4px;
    padding:6px;
    border-radius:999px;
    background:#fff;
    box-shadow:0 10px 28px rgba(43,27,51,0.25);
    animation:popIn .22s var(--ease-spring) both;
  }
  .rx-option{
    width:38px;height:38px;
    border:none;
    border-radius:50%;
    background:transparent;
    font-size:22px;
    cursor:pointer;
    padding:0;
    transition:transform .15s var(--ease-spring);
  }
  .rx-option:active{transform:scale(1.25);}
  .rx-option.active{background:rgba(255,111,145,0.16);}
  .highlight-row.both-love{
    border-color:rgba(255,111,145,0.55);
    background:linear-gradient(90deg, rgba(255,111,145,0.1), #fff 60%);
  }

  /* itinerary */
  .itinerary{padding-bottom:10px;}
  .itin-sub{font-size:12px;color:var(--ink-soft);margin:-4px 0 12px;}
  .itin-auto{
    display:block;
    width:100%;
    border:none;
    border-radius:999px;
    padding:11px;
    margin-bottom:14px;
    background:linear-gradient(90deg, var(--sky-pink), var(--sky-purple));
    color:#fff;
    font-family:'Poppins', sans-serif;
    font-weight:700;
    font-size:12.5px;
    cursor:pointer;
  }
  .itin-day{
    background:#fff;
    border:1.5px solid var(--line);
    border-radius:16px;
    padding:12px 14px 6px;
    margin-bottom:10px;
    animation:fadeSlideUp .35s var(--ease-out) both;
  }
  .itin-day-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px;}
  .itin-day-num{font-family:'Fraunces', serif;font-style:italic;font-weight:700;font-size:17px;}
  .itin-day-date{font-size:11px;font-weight:600;color:var(--turquoise-dim);}
  .itin-empty{font-size:12px;color:var(--ink-soft);padding:4px 0 6px;}
  .itin-stop{display:flex;align-items:center;gap:10px;padding:6px 0;border-top:1px solid rgba(43,27,51,0.06);}
  .itin-stop:first-of-type{border-top:none;}
  .itin-stop-num{
    flex:0 0 auto;
    width:22px;height:22px;
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    background:var(--plan-color, var(--coral));
    color:#fff;
    font-size:11px;
    font-weight:700;
  }
  .itin-stop-name{flex:1;min-width:0;font-size:12.5px;font-weight:500;}
  .itin-stop-love{font-size:11px;}
  .itin-suggest{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;}
  .itin-chip{
    border:1.5px solid var(--line);
    border-radius:999px;
    padding:6px 10px;
    background:#fff;
    font-family:'Poppins', sans-serif;
    font-size:11.5px;
    font-weight:600;
    color:var(--ink);
    cursor:pointer;
  }
  .itin-day .add-row{margin:4px 0 6px;}
  .itin-day .add-form{margin:6px 0 8px;}

  /* view transitions */
  html.vt-running .view, html.vt-running .view *{animation:none !important;}
  ::view-transition-old(root){animation:vtFadeOut .2s ease both;}
  ::view-transition-new(root){animation:vtFadeIn .32s var(--ease-out) both;}
  @keyframes vtFadeOut{ to{opacity:0;} }
  @keyframes vtFadeIn{ from{opacity:0;transform:translateY(10px);} }
  ::view-transition-group(dest-morph){animation-duration:.45s;animation-timing-function:cubic-bezier(0.16, 1, 0.3, 1);}
  ::view-transition-old(dest-morph), ::view-transition-new(dest-morph){height:100%;overflow:clip;object-fit:cover;}
  @media (prefers-reduced-motion: reduce){
    *{animation-duration:0.01ms !important;transition-duration:0.01ms !important;}
  }

  .round-backdrop{
    position:fixed;
    inset:0;
    z-index:310;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px 16px;
    overflow:hidden;
    font-family:'Poppins', sans-serif;
    color:#fff;
    background:radial-gradient(circle at 50% 38%, #FF6F91 0%, #8A5FBF 45%, #1f1238 100%);
    animation:fadeIn .25s ease both;
  }
  .round-backdrop.leaving{animation:roundLeave .28s ease-in forwards;}
  @keyframes roundLeave{ to{opacity:0;transform:scale(1.06);} }
  .round-rays{
    position:absolute;
    left:50%; top:38%;
    width:180vmax;height:180vmax;
    margin:-90vmax 0 0 -90vmax;
    background:repeating-conic-gradient(rgba(255,255,255,0.09) 0deg 8deg, transparent 8deg 22deg);
    animation:raysSpin 26s linear infinite;
    pointer-events:none;
  }
  @keyframes raysSpin{ to{transform:rotate(360deg);} }
  .round-box{position:relative;width:100%;max-width:360px;text-align:center;}
  .round-kicker{font-size:12px;font-weight:700;letter-spacing:0.26em;opacity:0.9;animation:fadeSlideUp .5s var(--ease-out) .1s both;}
  .round-word{
    font-weight:800;
    font-size:26px;
    letter-spacing:0.42em;
    margin:14px 0 -6px;
    padding-left:0.42em;
    animation:fadeSlideUp .5s var(--ease-out) .2s both;
  }
  .round-number{
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:128px;
    line-height:1;
    background:linear-gradient(180deg, #fff 20%, var(--sun));
    -webkit-background-clip:text;
    background-clip:text;
    -webkit-text-fill-color:transparent;
    filter:drop-shadow(0 10px 30px rgba(255,201,60,0.55));
    animation:roundSlam .7s cubic-bezier(0.2, 1.4, 0.4, 1) .35s both;
  }
  .round-number.is-text{font-size:68px;margin:6px 0;}
  @keyframes roundSlam{
    0%{transform:scale(3.2) rotate(-8deg);opacity:0;}
    60%{transform:scale(0.92) rotate(2deg);opacity:1;}
    80%{transform:scale(1.04) rotate(-1deg);}
    100%{transform:none;opacity:1;}
  }
  .round-sub{font-size:15px;font-weight:600;margin:6px 0 18px;animation:fadeSlideUp .5s var(--ease-out) .75s both;}
  .round-tiles{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-bottom:20px;}
  .round-tile{
    font-size:12px;
    font-weight:600;
    padding:6px 11px;
    border-radius:999px;
    background:rgba(255,255,255,0.18);
    border:1px solid rgba(255,255,255,0.3);
    backdrop-filter:blur(6px);
    animation:popIn .4s var(--ease-spring) both;
  }
  .round-rules{display:flex;justify-content:center;gap:10px;margin-bottom:22px;}
  .round-rule{
    flex:1;
    max-width:110px;
    padding:10px 6px;
    border-radius:16px;
    background:rgba(20,10,30,0.3);
    animation:fadeSlideUp .45s var(--ease-out) both;
  }
  .round-rule-icon{font-size:20px;font-weight:700;margin-bottom:2px;}
  .round-rule-label{font-size:11px;font-weight:600;opacity:0.9;line-height:1.3;}
  .round-go{animation:fadeSlideUp .5s var(--ease-out) 1.6s both;}
  .swipe-done.is-winner .confirm-btn{margin-top:4px;}
  .swipe-out{margin:-24px 0 40px;}
  .swipe-out-row{display:flex;flex-wrap:wrap;gap:6px;}
  .out-chip{
    border:1px solid rgba(255,255,255,0.3);
    border-radius:999px;
    padding:6px 12px;
    background:rgba(20,10,30,0.3);
    color:rgba(255,255,255,0.75);
    font-family:'Poppins', sans-serif;
    font-size:12px;
    font-weight:600;
    text-decoration:line-through;
    text-decoration-color:rgba(255,107,122,0.8);
    cursor:pointer;
  }
  .swipe-out-hint{font-size:11px;opacity:0.65;margin-top:8px;}

  /* it's a match */
  .match-backdrop{
    position:fixed;
    inset:0;
    z-index:300;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:24px 16px;
    overflow:hidden;
    font-family:'Poppins', sans-serif;
    background:radial-gradient(circle at 50% 30%, rgba(255,111,145,0.55), rgba(75,56,105,0.95) 70%);
    backdrop-filter:blur(8px);
    animation:fadeIn .25s ease both;
  }
  .confetti-bit{
    position:absolute;
    top:-40px;
    pointer-events:none;
    animation-name:confettiFall;
    animation-timing-function:linear;
    animation-fill-mode:both;
  }
  @keyframes confettiFall{
    0%{transform:translateY(0) rotate(0deg);opacity:1;}
    100%{transform:translateY(110vh) rotate(540deg);opacity:0.6;}
  }
  .match-box{
    position:relative;
    width:100%;
    max-width:340px;
    text-align:center;
    color:#fff;
    animation:popIn .5s var(--ease-spring) both;
  }
  .match-kicker{font-size:12px;font-weight:700;letter-spacing:0.3em;opacity:0.9;}
  .match-title{
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:54px;
    line-height:1;
    margin:4px 0 20px;
    text-shadow:0 6px 30px rgba(255,111,145,0.8);
  }
  .match-photo{
    position:relative;
    height:230px;
    border-radius:24px;
    overflow:hidden;
    border:3px solid #fff;
    background:linear-gradient(160deg, var(--plan-color), var(--plan-dim));
    background-size:cover;
    background-position:center;
    box-shadow:0 24px 50px rgba(20,10,30,0.5);
    margin-bottom:16px;
    transform:rotate(-2deg);
  }
  .match-photo::after{
    content:'';
    position:absolute;
    inset:0;
    background:linear-gradient(180deg, transparent 50%, rgba(20,10,30,0.75));
  }
  .match-photo-emoji{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:90px;opacity:0.6;}
  .match-photo-city{
    position:absolute;
    left:16px; bottom:12px;
    z-index:1;
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:28px;
  }
  .match-sub{font-size:14px;line-height:1.5;margin-bottom:20px;opacity:0.95;}
  .match-keep{
    display:block;
    width:100%;
    margin-top:10px;
    padding:13px;
    border:1.5px solid rgba(255,255,255,0.6);
    border-radius:999px;
    background:rgba(255,255,255,0.12);
    color:#fff;
    font-family:'Poppins', sans-serif;
    font-weight:600;
    font-size:13.5px;
    cursor:pointer;
  }

  @media (max-width:480px){
    .detail-city{font-size:23px;}
    .detail-code{font-size:20px;}
  }

`;

const APP_SCRIPT = `

const MEXICO_MAP_IMG = '/images/mexico-map.jpg';
const INTRO_HERO_IMG = '/images/intro-hero.jpg';
const SPLASH_IMG = '/images/splash.jpg';
const USA_MAP_IMG = '/images/usa-map.jpg';
const BG_PHOTO_IMG = '/images/bg-photo.jpg';
const PLAN_META = {
  beach:     { label: 'Playa',          color: '#0EA5A0', dim: '#0a7d79' },
  city:      { label: 'Ciudad',         color: '#FF6B5B', dim: '#e14f40' },
  colonial:  { label: 'Colonial',       color: '#8A5FBF', dim: '#6c479c' },
  nature:    { label: 'Naturaleza',     color: '#3F8F5C', dim: '#2f6c45' },
  nightlife: { label: 'Vida nocturna',  color: '#E0457B', dim: '#b83362' },
};
function planOf(d) { return PLAN_META[d.plan] || PLAN_META.city; }
function countryLabel(country) { return country === 'Mexico' ? 'México' : 'EE. UU.'; }
function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

const REGIONS = {
  mexico: {
    label: 'México',
    type: 'image',
    src: MEXICO_MAP_IMG,
    aspect: '900 / 686',
    destinations: [
      {
        id: 'cdmx', city: 'Ciudad de México', country: 'Mexico', code: 'CDMX', plan: 'city',
        vibe: 'Enorme, caótica y siempre buena — pirámides milenarias en las afueras, museos de primer nivel y cantinas en el centro, y mezcal en azoteas de Roma/Condesa por la noche. Altitud alta, energía a tope, un puesto de tacos en cada esquina.',
        price: 7807, note: null,
        highlights: [{ name: 'Pirámides', photo: null }, { name: 'Trajineras', photo: null }, { name: 'Chapultepec', photo: null }, { name: 'Bellas Artes', photo: null }, { name: 'Polanco', photo: null }, { name: 'La Mexicana', photo: null }, { name: 'Bar hopping Roma', photo: null }],
        photo: null, favorite: false, pin: { x: 58.0, y: 64.1 },
      },
      {
        id: 'cabo', city: 'Los Cabos', country: 'Mexico', code: 'SJD', plan: 'beach',
        vibe: 'Acantilados de desierto que caen directo al agua turquesa, el Arco, y una franja de resorts hecha para no hacer nada productivo, a propósito. Beach clubs ruidosos de día, cenas tranquilas en la marina de noche — pulido y un poco turístico, en el buen sentido.',
        price: 7920, note: null,
        highlights: [{ name: 'Mango Deck', photo: null }, { name: 'Bar hopping', photo: null }, { name: 'All-inclusive Rosewood · $5k/noche', photo: null }],
        photo: null, favorite: false, pin: { x: 24.7, y: 48.3 },
      },
      {
        id: 'gdl', city: 'Guadalajara', country: 'Mexico', code: 'GDL', plan: 'city',
        vibe: 'La cuna del mariachi y el tequila, con un centro colonial para caminar, plazas arboladas y los mercados de artesanías de Tlaquepaque a las afueras. Más tranquila y barata que la CDMX, con una escena gastronómica que sorprende para su tamaño.',
        price: 8000, note: null,
        highlights: [{ name: 'Catedral de Guadalajara', photo: null }, { name: 'Hospicio Cabañas', photo: null }, { name: 'Teatro Degollado', photo: null }, { name: 'Mercado San Juan de Dios', photo: null }, { name: 'Tlaquepaque', photo: null }, { name: 'Tonalá', photo: null }, { name: 'Templo Expiatorio', photo: null }, { name: 'Plaza Tapatía', photo: null }, { name: 'Basílica de Zapopan', photo: null }, { name: 'Barranca de Huentitán', photo: null }],
        photo: null, favorite: false, pin: { x: 44.6, y: 58.5 },
      },
      {
        id: 'pvr', city: 'Puerto Vallarta', country: 'Mexico', code: 'PVR', plan: 'beach',
        vibe: 'Calles empedradas y una montaña cubierta de selva se encuentran con el Pacífico a lo largo de un malecón hecho para caminar al atardecer. Romántico, un poco bohemio y famoso por ser muy LGBTQ+-friendly — tacos de pescado en la playa, luego drinks en una azotea viendo el cielo pintarse naranja.',
        price: 9739, note: null,
        highlights: [{ name: 'Malecón', photo: null }, { name: 'Playa Los Muertos', photo: null }, { name: 'Isla Cuale', photo: null }, { name: 'Zona Romántica', photo: null }, { name: 'Marina Vallarta', photo: null }, { name: 'Playa Mismaloya', photo: null }, { name: 'Sayulita', photo: null }, { name: 'Los Arcos', photo: null }, { name: 'Iglesia de Guadalupe', photo: null }, { name: 'Boca de Tomatlán', photo: null }],
        photo: null, favorite: false, pin: { x: 38.9, y: 59.2 },
      },
      {
        id: 'bajio', city: 'Guanajuato', country: 'Mexico', code: 'BJX', plan: 'colonial',
        vibe: 'Un laberinto de cerros con casas de colores, túneles subterráneos y callejones demasiado angostos para carros — más las calles de postal de San Miguel de Allende a un corto viaje en coche. México colonial de cuento, mejor explorado a pie y un poco perdidos.',
        price: 7807, note: 'San Miguel de Allende / Guanajuato Capital',
        cities: ['Guanajuato Capital', 'San Miguel de Allende'],
        highlights: [{ name: 'Ciudad de México', photo: null }, { name: 'Guanajuato capital', photo: null }, { name: 'San Miguel de Allende', photo: null }],
        photo: null, favorite: false, pin: { x: 51.2, y: 57.3 },
      },
    ],
  },
  usa: {
    label: 'EE. UU.',
    type: 'image',
    src: USA_MAP_IMG,
    aspect: '1400 / 1052',
    destinations: [
      {
        id: 'tahoe', city: 'Lake Tahoe', country: 'USA', code: 'RNO', plan: 'nature',
        vibe: 'Un lago alpino de un azul ridículo, rodeado de bosque de pinos y montañas — hiking o paddleboard en verano, pistas de esquí a minutos de la orilla en invierno. Aire fresco, cabañas acogedoras y vistas que te dejan a media frase.',
        price: 7920, note: 'vía aeropuerto de SF',
        highlights: [{ name: 'Emerald Bay', photo: null }, { name: 'Heavenly Ski Resort', photo: null }, { name: 'Sand Harbor', photo: null }, { name: 'Palisades Tahoe', photo: null }, { name: 'Vikingsholm', photo: null }, { name: 'Rubicon Trail', photo: null }, { name: 'Tahoe Rim Trail', photo: null }, { name: 'D.L. Bliss State Park', photo: null }, { name: 'South Lake Tahoe waterfront', photo: null }, { name: 'Fannette Island', photo: null }],
        photo: null, favorite: false, pin: { x: 16.65, y: 32.9 },
      },
      {
        id: 'vegas', city: 'Las Vegas', country: 'USA', code: 'LAS', plan: 'nightlife',
        vibe: 'El Strip de neón, casinos abiertos toda la noche, pool parties y un show para cada mood. Nadie duerme, todo está abierto a las 3am, y el viaje puede ser tan extra (o tan chill junto a la alberca) como quieras.',
        costs: { edu: 4000, eleny: 3000 }, note: null,
        highlights: [{ name: 'The Strip', photo: null }, { name: 'Bellagio Fountains', photo: null }, { name: 'Fremont Street', photo: null }, { name: 'Caesars Palace', photo: null }, { name: 'Red Rock Canyon', photo: null }, { name: 'High Roller', photo: null }, { name: 'The Sphere', photo: null }, { name: 'Hoover Dam', photo: null }, { name: 'Venetian Grand Canal Shoppes', photo: null }, { name: 'Cirque du Soleil', photo: null }],
        photo: null, favorite: false, pin: { x: 23.4, y: 46.25 },
      },
      {
        id: 'austin', city: 'Austin / San Antonio', country: 'USA', code: 'AUS', plan: 'city',
        vibe: 'Dos ciudades de Texas muy distintas a una hora de distancia: la música en vivo, food trucks y días de lago de Austin contra el Álamo, el River Walk y la historia del viejo Texas de San Antonio. Fácil de combinar en una sola visita tipo road trip, sin prisa.',
        costs: { edu: 3000, eleny: 4500 }, note: null,
        cities: ['Austin', 'San Antonio'],
        highlights: [{ name: 'The Alamo', photo: null }, { name: 'River Walk', photo: null }, { name: 'South Congress Ave', photo: null }, { name: 'Texas State Capitol', photo: null }, { name: 'Lady Bird Lake', photo: null }, { name: 'Barton Springs Pool', photo: null }, { name: 'Sixth Street', photo: null }, { name: 'McNay Art Museum', photo: null }, { name: 'Zilker Park', photo: null }, { name: 'Franklin Barbecue', photo: null }],
        photo: null, favorite: false, pin: { x: 49.8, y: 66.3 },
      },
      {
        id: 'miami', city: 'Miami', country: 'USA', code: 'MIA', plan: 'beach',
        vibe: 'Pasteles Art Deco en South Beach, café cubano en cada cuadra, y una vida nocturna que empieza tarde y no se disculpa por eso. Caliente, glamorosa e inconfundiblemente latina — playa de día, salsa de noche.',
        costs: { edu: 7261, eleny: 6000 }, note: null,
        highlights: [{ name: 'South Beach', photo: null }, { name: 'Art Deco District', photo: null }, { name: 'Wynwood Walls', photo: null }, { name: 'Little Havana', photo: null }, { name: 'Bayside Marketplace', photo: null }, { name: 'Vizcaya Museum & Gardens', photo: null }, { name: 'Coral Gables', photo: null }, { name: 'Brickell City Centre', photo: null }, { name: 'Ocean Drive', photo: null }, { name: 'Key Biscayne', photo: null }],
        photo: null, favorite: false, pin: { x: 81.1, y: 73.4 },
      },
      {
        id: 'sandiego', city: 'San Diego', country: 'USA', code: 'SAN', plan: 'beach',
        vibe: 'Energía relajada de pueblo surfero, clima casi perfecto todo el año, y una escena de cerveza artesanal a la altura. Balboa Park, días fáciles de playa, y un salto corto a México si quieres tacos del otro lado de la frontera.',
        price: 6500, note: null,
        highlights: [{ name: 'Balboa Park', photo: null }, { name: 'San Diego Zoo', photo: null }, { name: 'Gaslamp Quarter', photo: null }, { name: 'La Jolla Cove', photo: null }, { name: 'USS Midway Museum', photo: null }, { name: 'Coronado Island', photo: null }, { name: 'Old Town San Diego', photo: null }, { name: 'Sunset Cliffs', photo: null }, { name: 'Pacific Beach', photo: null }, { name: 'Torrey Pines', photo: null }],
        photo: null, favorite: false, pin: { x: 19.15, y: 54.6 },
      },
    ],
  },
};

const money = n => '$' + n.toLocaleString('en-US');

// Iconic highlights for custom cities (added via "+ add city") that don't have
// any yet, keyed by lowercased city name. Only fills in destinations with an
// empty highlights list — never touches one that already has entries.
const ICONIC_HIGHLIGHTS_BY_CITY = {};
function registerIconic(names, highlights) {
  names.forEach(name => { ICONIC_HIGHLIGHTS_BY_CITY[name.toLowerCase()] = highlights; });
}
// Mexico
registerIconic(['Bacalar'], ['Laguna de los Siete Colores', 'Cenote Azul', 'Fuerte de San Felipe', 'Canal de los Piratas', 'Los Rápidos', 'Cenote Esmeralda', 'Cenote Cocalitos', 'Isla de los Pájaros', 'Malecón de Bacalar', 'Paseo en velero por la laguna']);
registerIconic(['Merida', 'Mérida'], ['Paseo de Montejo', 'Catedral de San Ildefonso', 'Gran Museo del Mundo Maya', 'Plaza Grande', 'Mercado Lucas de Gálvez', 'Casa de Montejo', 'Parque de Santa Lucía', 'Palacio de Gobierno de Yucatán', 'Zona Arqueológica de Dzibilchaltún', 'Barrio de Santiago']);
registerIconic(['Puerto Escondido'], ['Playa Zicatela', 'Playa Carrizalillo', 'Playa Puerto Angelito', 'Laguna de Manialtepec', 'Mirador de la Punta', 'Playa Marinero', 'Punta Zicatela', 'Parque Nacional Lagunas de Chacahua', 'Playa Bacocho', 'El Adoquín']);
registerIconic(['Mazatlan', 'Mazatlán'], ['Malecón de Mazatlán', 'Centro Histórico de Mazatlán', 'Faro de Mazatlán', 'Isla de la Piedra', 'Playa Olas Altas', 'Catedral Basílica de la Inmaculada Concepción', 'Teatro Ángela Peralta', 'Acuario Mazatlán', 'Zona Dorada', 'Cerro del Crestón']);
registerIconic(['Tulum'], ['Zona Arqueológica de Tulum', 'Playa Paraíso', 'Gran Cenote', 'Cenote Calavera', 'Playa Ruinas', 'Aldea Zamá', 'Cenote Dos Ojos', 'Punta Piedra', 'Playa Santa Fe', 'Casa Malca área']);
registerIconic(['Cancun', 'Cancún'], ['Zona Hotelera', 'Playa Delfines', 'Isla Mujeres (ferry)', 'Museo Subacuático de Arte (MUSA)', 'Zona Arqueológica El Rey', 'Mercado 28', 'La Isla Shopping Village', 'Coco Bongo', 'Playa Tortugas', 'Xcaret (excursión)']);
registerIconic(['Playa del Carmen'], ['Quinta Avenida', 'Playa Mamitas', 'Xcaret Park', 'Xplor Park', 'Rio Secreto', 'Coco Beach', 'Parque Los Fundadores', 'Xel-Há', 'Cenote Cristalino', 'Punta Esmeralda']);
registerIconic(['Cozumel'], ['Arrecife Palancar', 'Playa Chen Río', 'Zona Arqueológica de San Gervasio', 'Punta Sur Eco Beach Park', 'Playa Palancar', 'Parque Chankanaab', 'Malecón de Cozumel', 'Playa Bonita', 'El Cielo (banco de arena)', 'Faro Celarain']);
registerIconic(['Isla Mujeres'], ['Playa Norte', 'Punta Sur', 'MUSA (museo subacuático)', 'Isla Contoy (excursión)', 'Garrafón Reef Park', 'Playa Indios', 'Dolphin Discovery', 'Hacienda Mundaca', 'Playa Lancheros', 'Tour de tiburón ballena']);
registerIconic(['Oaxaca'], ['Zócalo de Oaxaca', 'Templo de Santo Domingo', 'Monte Albán', 'Hierve el Agua', 'Mercado Benito Juárez', 'Fábricas de mezcal', 'Museo Textil de Oaxaca', 'Teotitlán del Valle', 'Árbol del Tule', 'Mercado 20 de Noviembre']);
registerIconic(['San Miguel de Allende'], ['Parroquia de San Miguel Arcángel', 'El Jardín', 'Fábrica La Aurora', 'Mirador de San Miguel', 'Instituto Allende', 'Mercado de Artesanías', 'La Esquina Museo', 'Parque Juárez', 'Santuario de Atotonilco', 'Callejón del Beso']);
registerIconic(['Monterrey'], ['Cerro de la Silla', 'Parque Fundidora', 'Macroplaza', 'Barrio Antiguo', 'Paseo Santa Lucía', 'Museo de Historia Mexicana', 'Chipinque', 'Cascada Cola de Caballo', 'Grutas de García', 'Cañón de la Huasteca']);
registerIconic(['Ensenada'], ['La Bufadora', 'Riviera del Pacífico', 'Valle de Guadalupe (viñedos)', 'Mercado Negro', 'Malecón de Ensenada', 'Playa Hermosa', 'Isla de Todos Santos', 'Estero Beach', 'Bodegas de Santo Tomás', 'Catedral de Nuestra Señora de Guadalupe']);
registerIconic(['La Paz'], ['Malecón de La Paz', 'Isla Espíritu Santo', 'El Mogote', 'Playa Balandra', 'Nado con tiburón ballena', 'Playa Tecolote', 'Museo Regional de Antropología', 'Isla de la Roca', 'Mercado Municipal', 'Lobos marinos en Los Islotes']);
registerIconic(['Zihuatanejo'], ['Playa La Ropa', 'Playa Madera', 'Playa Las Gatas', 'Muelle Municipal', 'Museo Arqueológico de la Costa Grande', 'Isla Ixtapa', 'Playa Principal', 'Mirador Cerro del Vigía', 'Paseo del Pescador', 'Marina Ixtapa']);
registerIconic(['Acapulco'], ['Clavadistas de La Quebrada', 'Playa Condesa', 'Fuerte de San Diego', 'Playa Revolcadero', 'Isla la Roqueta', 'Playa Icacos', 'Zócalo de Acapulco', 'Capilla de la Paz', 'Malecón de Acapulco', 'Playa Caleta']);
registerIconic(['Huatulco'], ['Bahías de Huatulco', 'Playa Santa Cruz', 'Playa La Entrega', 'Parque Nacional Huatulco', 'Playa Maguey', 'Playa Órgano', 'Mirador Escénico', 'La Crucecita', 'Playa Conejos', 'Cascadas Copalitilla']);
registerIconic(['San Cristobal de las Casas', 'San Cristóbal de las Casas'], ['Templo de Santo Domingo', 'Andador Turístico', 'Cañón del Sumidero', 'Cerro de San Cristóbal', 'Casa Na Bolom', 'Mercado de Santo Domingo', 'Iglesia de Guadalupe', 'San Juan Chamula', 'Zinacantán', 'Arco del Carmen']);
registerIconic(['Veracruz'], ['Malecón de Veracruz', 'Zócalo de Veracruz', 'Fuerte de San Juan de Ulúa', 'Isla de Sacrificios', 'Acuario de Veracruz', 'Boca del Río', 'Fuerte de Santiago', 'Museo Naval', 'Playa Villa del Mar', 'Plaza de Armas']);
registerIconic(['Puebla'], ['Zócalo de Puebla', 'Catedral de Puebla', 'Talleres de Talavera', 'Gran Pirámide de Cholula', 'Callejón de los Sapos', 'Museo Amparo', 'Barrio del Artista', 'Africam Safari', 'Fuertes de Loreto y Guadalupe', 'Capilla del Rosario']);
// USA
registerIconic(['New York', 'New York City', 'NYC'], ['Times Square', 'Central Park', 'Statue of Liberty', 'Empire State Building', 'Brooklyn Bridge', 'The Met', 'The High Line', 'Rockefeller Center', 'SoHo', 'Broadway show']);
registerIconic(['Los Angeles', 'LA'], ['Hollywood Sign', 'Santa Monica Pier', 'Griffith Observatory', 'Venice Beach', 'Rodeo Drive', 'Getty Center', 'Universal Studios', 'Hollywood Walk of Fame', 'The Grove', 'Malibu']);
registerIconic(['San Francisco'], ['Golden Gate Bridge', 'Alcatraz Island', "Fisherman's Wharf", 'Lombard Street', 'Chinatown', 'Painted Ladies', 'Pier 39', 'Union Square', 'Twin Peaks', 'Golden Gate Park']);
registerIconic(['Seattle'], ['Space Needle', 'Pike Place Market', 'Chihuly Garden and Glass', 'Museum of Pop Culture', 'Kerry Park', 'Gas Works Park', 'Pioneer Square', 'Fremont Troll', 'Olympic Sculpture Park', 'Snoqualmie Falls']);
registerIconic(['Portland'], ["Powell's City of Books", 'Washington Park', 'International Rose Test Garden', 'Pioneer Courthouse Square', 'Multnomah Falls', 'Portland Saturday Market', 'Portland Japanese Garden', 'Forest Park', 'Pittock Mansion', 'Food cart pods']);
registerIconic(['Chicago'], ['Millennium Park (The Bean)', 'Navy Pier', 'Willis Tower Skydeck', 'Art Institute of Chicago', 'Magnificent Mile', 'Lincoln Park Zoo', 'Wrigley Field', 'Chicago Riverwalk', 'Museum Campus', 'Deep-dish pizza tour']);
registerIconic(['New Orleans'], ['French Quarter', 'Bourbon Street', 'Jackson Square', 'Garden District', 'St. Louis Cathedral', 'Café du Monde', 'Frenchmen Street', 'National WWII Museum', 'Streetcar ride', 'City Park']);
registerIconic(['Orlando'], ['Walt Disney World', 'Universal Orlando Resort', 'Lake Eola Park', 'ICON Park', 'Gatorland', 'Kennedy Space Center', 'Winter Park', 'Disney Springs', 'SeaWorld Orlando', 'CityWalk']);
registerIconic(['Key West'], ['Duval Street', 'Southernmost Point', 'Mallory Square sunset', 'Ernest Hemingway Home', 'Key West Lighthouse', 'Dry Tortugas', 'Fort Zachary Taylor Beach', 'Smathers Beach', 'Truman Little White House', 'Conch Tour Train']);
registerIconic(['Santa Fe'], ['Santa Fe Plaza', 'Canyon Road galleries', "Georgia O'Keeffe Museum", 'Loretto Chapel', 'San Miguel Mission', 'Meow Wolf', 'Palace of the Governors', 'Cathedral Basilica of St. Francis', 'Ten Thousand Waves', 'Museum Hill']);
registerIconic(['Sedona'], ['Cathedral Rock', 'Bell Rock', 'Chapel of the Holy Cross', 'Oak Creek Canyon', 'Airport Mesa', 'Red Rock State Park', 'Slide Rock State Park', "Devil's Bridge", 'Tlaquepaque Arts Village', 'Boynton Canyon']);
registerIconic(['Napa Valley', 'Napa'], ['Napa Valley Wine Train', 'Oxbow Public Market', 'Castello di Amorosa', 'Downtown Napa', 'Culinary Institute of America', 'Calistoga hot springs', 'Yountville restaurants', 'Silverado Trail wineries', 'Old Faithful Geyser of California', 'Robert Louis Stevenson State Park']);
registerIconic(['Nashville'], ['Broadway honky-tonks', 'Country Music Hall of Fame', 'Grand Ole Opry', 'The Parthenon', 'Ryman Auditorium', 'Music Row', 'Centennial Park', 'Johnny Cash Museum', 'Printers Alley', 'RCA Studio B']);
registerIconic(['Denver'], ['Larimer Square', 'Denver Botanic Gardens', 'Red Rocks Amphitheatre', 'Union Station', 'Denver Art Museum', '16th Street Mall', 'City Park', 'Colorado State Capitol', 'Cherry Creek Trail', 'Empower Field']);
registerIconic(['Boston'], ['Freedom Trail', 'Fenway Park', 'Boston Common', 'Faneuil Hall', 'Harvard Square', 'North End', 'Boston Public Garden', 'USS Constitution', 'Newbury Street', 'Quincy Market']);
registerIconic(['Washington DC', 'Washington D.C.', 'DC'], ['National Mall', 'Lincoln Memorial', 'Smithsonian museums', 'U.S. Capitol', 'White House', 'Georgetown', 'Jefferson Memorial', 'Arlington National Cemetery', 'National Gallery of Art', 'Tidal Basin cherry blossoms']);
registerIconic(['Savannah'], ['Forsyth Park', 'Historic District squares', 'River Street', 'Bonaventure Cemetery', 'Tybee Island', 'Cathedral of St. John the Baptist', 'Mercer Williams House', 'City Market', 'Telfair Museums', 'Wormsloe Historic Site']);
registerIconic(['Charleston'], ['Rainbow Row', 'Battery Park', 'Charleston City Market', 'Fort Sumter', 'Magnolia Plantation', 'Folly Beach', 'King Street shopping', 'Middleton Place', 'USS Yorktown', 'Angel Oak Tree']);
registerIconic(['Honolulu', 'Oahu'], ['Waikiki Beach', 'Diamond Head', 'Pearl Harbor', 'Iolani Palace', 'Hanauma Bay', 'Ala Moana Center', "North Shore", 'Byodo-In Temple', 'Kualoa Ranch', 'Polynesian Cultural Center']);

function applyIconicHighlights(d) {
  if (!d || d.highlights.length) return false;
  const list = ICONIC_HIGHLIGHTS_BY_CITY[d.city.trim().toLowerCase()];
  if (!list) return false;
  d.highlights = list.map(name => ({ name, city: null, photo: null }));
  return true;
}

function backfillIconicHighlights() {
  Object.keys(REGIONS).forEach(regionKey => {
    const r = REGIONS[regionKey];
    let changed = false;
    r.destinations.forEach(d => { if (d.custom && applyIconicHighlights(d)) changed = true; });
    if (changed) saveCustomDestinations(regionKey);
  });
}

function getDest(id) {
  for (const key of Object.keys(REGIONS)) {
    const found = REGIONS[key].destinations.find(d => d.id === id);
    if (found) return found;
  }
  return null;
}
function destTotal(d) {
  if (d.costs && d.costs.myTransport != null) {
    const c = d.costs;
    return (c.myTransport || 0) + (c.elenyTransport || 0) + (c.gas || 0) + (c.tolls || 0) + (c.hotel || 0);
  }
  if (d.costs && d.costs.edu != null) return (d.costs.edu || 0) + (d.costs.eleny || 0);
  if (d.price != null) return d.price;
  return 0;
}

const ADMIN_CODE = 'aguacate9';
const STORAGE_KEY = 'priorities-state';

function allDestinations() {
  return [...REGIONS.mexico.destinations, ...REGIONS.usa.destinations];
}

let blockedIds = [];
let hiddenIds = [];
let elenyHiddenIds = []; // destinations Luis has hidden from Mich's map/list (still visible to Luis)
let profileInfo = {};
let tripStart = null; // 'YYYY-MM-DD'
let tripEnd = null;


// Describes a failed save so the alert says exactly what went wrong, since
// that's the only way to see a production error without server log access.
async function describeFailure(res, err) {
  if (err) return 'error de red: ' + (err && err.message ? err.message : String(err));
  let bodyText = '';
  try { bodyText = (await res.text()).slice(0, 200); } catch (e) { /* ignore */ }
  return 'HTTP ' + res.status + (bodyText ? ' — ' + bodyText : '');
}

// Sends only the named fields, so one phone never overwrites what the other changed.
// keepalive keeps the request alive even if the tab gets backgrounded right
// after (e.g. right after tapping delete), instead of it being dropped mid-flight.
async function saveState(fields) {
  const all = { blockedIds, hiddenIds, elenyHiddenIds, tripStart, tripEnd };
  const body = {};
  fields.forEach(f => { body[f] = all[f]; });
  try {
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
    if (res.ok) return { ok: true };
    return { ok: false, detail: await describeFailure(res) };
  } catch (e) { return { ok: false, detail: await describeFailure(null, e) }; }
}
async function saveProfileInfoNow() {
  try {
    const res = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileInfoFor: { profile, info: profileInfo[profile] || {} } }),
      keepalive: true,
    });
    if (!res.ok) window.alert('No se guardó (' + await describeFailure(res) + ') — revisa tu conexión e intenta de nuevo.');
    return res.ok;
  } catch (e) {
    window.alert('No se guardó (' + await describeFailure(null, e) + ') — revisa tu conexión e intenta de nuevo.');
    return false;
  }
}
async function loadPriorities() {
  try {
    const res = await fetch('/api/state');
    if (res.ok) {
      const parsed = await res.json();
      if (parsed) {
        blockedIds = parsed.blockedIds || [];
        hiddenIds = parsed.hiddenIds || [];
        elenyHiddenIds = parsed.elenyHiddenIds || [];
        profileInfo = parsed.profileInfo || {};
        tripStart = parsed.tripStart || null;
        tripEnd = parsed.tripEnd || null;
      }
    }
  } catch (e) { /* keep defaults */ }
}

// ---- highlights list (names + city tags; photos are tracked separately) ----
async function saveHighlights(destId) {
  const d = getDest(destId);
  try {
    await fetch('/api/highlights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destId,
        highlights: d.highlights.map(h => ({ name: h.name, city: h.city || null })),
      }),
      keepalive: true,
    });
  } catch (e) { /* best-effort only */ }
}

async function loadHighlightsData() {
  try {
    const res = await fetch('/api/highlights');
    if (!res.ok) return;
    const map = await res.json();
    Object.keys(map).forEach(destId => {
      const d = getDest(destId);
      if (!d || !map[destId].length) return;
      d.highlights = map[destId].map(h => ({ name: h.name, city: h.city || null, photo: null }));
    });
  } catch (e) { /* keep defaults */ }
}

// ---- lodging list ----
async function saveLodging(destId) {
  const d = getDest(destId);
  try {
    await fetch('/api/lodging', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destId,
        lodging: (d.lodging || []).map(l => ({ name: l.name, url: l.url || null })),
      }),
      keepalive: true,
    });
  } catch (e) { /* best-effort only */ }
}

async function loadLodgingData() {
  try {
    const res = await fetch('/api/lodging');
    if (!res.ok) return;
    const map = await res.json();
    Object.keys(map).forEach(destId => {
      const d = getDest(destId);
      if (!d) return;
      d.lodging = map[destId].map(l => ({ name: l.name, url: l.url || null }));
    });
  } catch (e) { /* keep defaults */ }
}

// ---- admin-only cost breakdown (never shown to Mich) ----
const EMPTY_COSTS = { myTransport: 0, elenyTransport: 0, gas: 0, tolls: 0, hotel: 0 };

let costsSaveTimer = null;
function saveCosts(destId) {
  const d = getDest(destId);
  clearTimeout(costsSaveTimer);
  costsSaveTimer = setTimeout(() => {
    fetch('/api/costs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destId, costs: d.costs }),
      keepalive: true,
    }).catch(() => {});
  }, 400);
}

async function loadCostsData() {
  try {
    const res = await fetch('/api/costs');
    if (!res.ok) return;
    const map = await res.json();
    Object.keys(map).forEach(destId => {
      const d = getDest(destId);
      if (!d) return;
      d.costs = { ...EMPTY_COSTS, ...map[destId] };
    });
  } catch (e) { /* keep defaults */ }
}

function setCostField(destId, field, value) {
  const d = getDest(destId);
  if (!d.costs) d.costs = { ...EMPTY_COSTS };
  d.costs[field] = Number(value) || 0;
  saveCosts(destId);
}

function addLodging(id, text, url) {
  const d = getDest(id);
  if (!d.lodging) d.lodging = [];
  if (text && text.trim()) {
    let cleanUrl = url && url.trim() ? url.trim() : null;
    if (cleanUrl && cleanUrl.toLowerCase().indexOf('http://') !== 0 && cleanUrl.toLowerCase().indexOf('https://') !== 0) {
      cleanUrl = 'https://' + cleanUrl;
    }
    d.lodging.push({ name: text.trim(), url: cleanUrl });
    saveLodging(id);
  }
  openAddLodging = false;
  render();
}
function removeLodging(id, idx) {
  const d = getDest(id);
  const l = d.lodging[idx];
  d.lodging.splice(idx, 1);
  render();
  saveLodging(id);
  if (l.photo) savePhoto(photoKeyForLodging(id, l.name), null);
}

// ---- custom destinations (added from the map via "+ Add city") ----
async function saveCustomDestinations(regionKey) {
  try {
    await fetch('/api/destinations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        region: regionKey,
        destinations: REGIONS[regionKey].destinations.filter(d => d.custom),
      }),
      keepalive: true,
    });
  } catch (e) { /* best-effort only */ }
}

async function loadCustomDestinations() {
  try {
    const res = await fetch('/api/destinations');
    if (!res.ok) return;
    const map = await res.json();
    Object.keys(map).forEach(regionKey => {
      const r = REGIONS[regionKey];
      if (!r) return;
      map[regionKey].forEach(d => {
        if (r.destinations.some(existing => existing.id === d.id)) return;
        r.destinations.push(d);
      });
    });
  } catch (e) { /* keep defaults */ }
}

function addCustomDestination(city, plan) {
  if (!city || !city.trim() || !addingCity || addingCity.step !== 'form') return;
  const key = cityKey({ city: city.trim(), country: region === 'mexico' ? 'Mexico' : 'USA' });
  const existing = allDestinations().find(x => !hiddenIds.includes(x.id) && cityKey(x) === key);
  if (existing) {
    addingCity = null;
    window.alert(existing.city + ' ya está en el mapa.');
    goDetail(cityGroups().repOf[existing.id] || existing.id);
    return;
  }
  const r = REGIONS[region];
  const id = 'custom-' + Date.now();
  const d = {
    id, city: city.trim(),
    country: region === 'mexico' ? 'Mexico' : 'USA',
    code: city.trim().slice(0, 3).toUpperCase(),
    plan, price: 0, note: null,
    highlights: [], photo: null, favorite: false,
    pin: addingCity.pin,
    custom: true,
  };
  applyIconicHighlights(d);
  r.destinations.push(d);
  addingCity = null;
  render();
  saveCustomDestinations(region);
  notifyPartner('city_added', d.city, 0, d.id);
}

// ---- photos (uploaded from the device, persisted as compressed data URLs) ----
function photoKeyForHighlight(id, name) {
  return 'dest:' + id + ':highlight:' + name;
}
function photoKeyForLodging(id, name) {
  return 'dest:' + id + ':lodging:' + name;
}
function photoKeyForCover(id) {
  return 'dest:' + id + ':cover';
}

async function savePhoto(key, dataUrl) {
  try {
    const res = await fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, dataUrl }),
    });
    return res.ok;
  } catch (e) { return false; }
}

const loadedPhotoDestIds = new Set();
const photoFetchPromises = new Map(); // destId -> in-flight promise, shared by every caller

// Fetches every destination's photos in a single request (instead of one
// request per destination), so covers don't visibly pop in one at a time
// across the map/swipe/detail screens. Falls back to the old per-destination
// loading below if this fails.
async function fetchAllPhotosMap() {
  try {
    const res = await fetch('/api/photos');
    if (!res.ok) return null;
    return await res.json();
  } catch (e) { return null; }
}
function applyPhotosMap(map) {
  if (!map) return;
  allDestinations().forEach(d => {
    if (map[photoKeyForCover(d.id)]) d.cover = map[photoKeyForCover(d.id)];
    d.highlights.forEach(h => {
      const hKey = photoKeyForHighlight(d.id, h.name);
      if (map[hKey]) h.photo = map[hKey];
    });
    (d.lodging || []).forEach(l => {
      const lKey = photoKeyForLodging(d.id, l.name);
      if (map[lKey]) l.photo = map[lKey];
    });
    loadedPhotoDestIds.add(d.id);
  });
}
function loadPhotosFor(destId) {
  if (loadedPhotoDestIds.has(destId)) return Promise.resolve();
  if (photoFetchPromises.has(destId)) return photoFetchPromises.get(destId);
  const d = getDest(destId);
  if (!d) return Promise.resolve();
  const p = (async () => {
    try {
      const res = await fetch('/api/photos?destId=' + encodeURIComponent(destId));
      if (!res.ok) return;
      const map = await res.json();
      loadedPhotoDestIds.add(destId);
      if (map[photoKeyForCover(d.id)]) d.cover = map[photoKeyForCover(d.id)];
      d.highlights.forEach(h => {
        const hKey = photoKeyForHighlight(d.id, h.name);
        if (map[hKey]) h.photo = map[hKey];
      });
      (d.lodging || []).forEach(l => {
        const lKey = photoKeyForLodging(d.id, l.name);
        if (map[lKey]) l.photo = map[lKey];
      });
    } catch (e) { /* keep defaults */ }
    finally { photoFetchPromises.delete(destId); }
  })();
  photoFetchPromises.set(destId, p);
  return p;
}
const COVER_SHADE = 'linear-gradient(180deg, rgba(20,10,30,0.15), rgba(20,10,30,0.72)), ';
function coverBackground(d, shaded) {
  return (shaded ? COVER_SHADE : '') + 'url("' + d.cover + '")';
}
// Paints a cover onto already-rendered elements tagged with data-cover-for,
// so photos arriving after render don't force a full re-render.
function paintCover(id) {
  const d = getDest(id);
  if (!d || !d.cover) return;
  document.querySelectorAll('[data-cover-for="' + id + '"]').forEach(node => {
    node.style.backgroundImage = coverBackground(d, !!node.dataset.coverShade);
    node.classList.add('has-cover');
    node.classList.remove('no-cover');
    const emoji = node.querySelector('.swipe-card-emoji');
    if (emoji) emoji.remove();
  });
}
function prefetchCovers(ids) {
  ids.filter(id => !loadedPhotoDestIds.has(id)).forEach(id => {
    loadPhotosFor(id).then(() => paintCover(id));
  });
}

function fileToCompressedDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not read image'));
      img.onload = () => {
        const maxDim = 1600;
        let width = img.width, height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
          else { width = Math.round(width * maxDim / height); height = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function pickPhoto(onPicked) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', async () => {
    const file = input.files && input.files[0];
    if (!file) return;
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      onPicked(dataUrl);
    } catch (e) {
      window.alert('No se pudo cargar esa foto.');
    }
  });
  input.click();
}

function showPhotoLightbox(src, alt, onReplace) {
  const backdrop = el('div', 'lightbox-backdrop');

  const closeBtn = el('button', 'lightbox-close', '×');
  closeBtn.setAttribute('aria-label', 'Cerrar');
  backdrop.appendChild(closeBtn);

  const img = document.createElement('img');
  img.className = 'lightbox-img';
  img.src = src;
  img.alt = alt || '';
  backdrop.appendChild(img);

  const actions = el('div', 'lightbox-actions');
  const downloadLink = document.createElement('a');
  downloadLink.className = 'lightbox-btn';
  downloadLink.href = src;
  downloadLink.download = (alt || 'photo').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.jpg';
  downloadLink.textContent = '⬇ Descargar';
  actions.appendChild(downloadLink);

  if (onReplace) {
    const replaceBtn = el('button', 'lightbox-btn', 'Reemplazar');
    replaceBtn.addEventListener('click', () => { close(); onReplace(); });
    actions.appendChild(replaceBtn);
  }
  backdrop.appendChild(actions);

  function close() { backdrop.remove(); }
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

  document.body.appendChild(backdrop);
}




// ---- state ----
let view = 'splash'; // 'splash' | 'intro' | 'map' | 'detail'
let region = 'mexico'; // 'mexico' | 'usa'
let detailId = null;
let openAddHighlight = false;
let openAddLodging = false;
let selectedHighlightCity = null;
let addingCity = null; // null | { step: 'pin' } | { step: 'form', pin: {x,y} }
let movingPinId = null; // id of a custom destination currently being repositioned, or null
let profile = null; // 'eleny' | 'luis'
let isAdmin = false;

function selectProfile(p) {
  if (p === 'eleny') {
    profile = 'eleny';
    isAdmin = false;
    view = 'map';
    render();
    return;
  }
  showPasscodeModal().then(unlocked => {
    if (!unlocked) return;
    profile = 'luis';
    isAdmin = true;
    view = 'map';
    render();
  });
}

function showPasscodeModal() {
  return new Promise((resolve) => {
    const backdrop = el('div', 'passcode-backdrop');
    const card = el('div', 'passcode-card');
    card.appendChild(el('div', 'passcode-title', 'Ingresa la contraseña'));
    card.appendChild(el('div', 'passcode-sub', 'Esto desbloquea la vista de Luis.'));

    const input = document.createElement('input');
    input.type = 'password';
    input.autocomplete = 'off';
    input.autocapitalize = 'off';
    input.spellcheck = false;
    input.className = 'passcode-input';
    input.placeholder = '••••••••';
    card.appendChild(input);

    const error = el('div', 'passcode-error');
    card.appendChild(error);

    const actions = el('div', 'passcode-actions');
    const cancelBtn = el('button', 'passcode-btn passcode-cancel', 'Cancelar');
    const okBtn = el('button', 'passcode-btn passcode-ok', 'Desbloquear');
    actions.appendChild(cancelBtn);
    actions.appendChild(okBtn);
    card.appendChild(actions);

    backdrop.appendChild(card);
    document.body.appendChild(backdrop);
    setTimeout(() => input.focus(), 50);

    function close(unlocked) {
      backdrop.remove();
      resolve(unlocked);
    }
    function tryUnlock() {
      if (input.value.trim().toLowerCase() === ADMIN_CODE) {
        close(true);
        return;
      }
      error.textContent = 'Contraseña incorrecta';
      input.value = '';
      input.focus();
      card.classList.remove('shake');
      void card.offsetWidth; // restart the animation
      card.classList.add('shake');
    }
    cancelBtn.addEventListener('click', () => close(false));
    okBtn.addEventListener('click', tryUnlock);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') tryUnlock();
      if (e.key === 'Escape') close(false);
    });
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(false); });
  });
}
function goIntro() {
  view = 'intro';
  profile = null;
  isAdmin = false;
  detailId = null;
  render();
}

let profileReturnView = 'map';
function goProfile() {
  navigate(() => {
    profileReturnView = view;
    view = 'profile';
    window.scrollTo(0, 0);
    render();
    applyPendingScroll();
  });
}
function backFromProfile() {
  navigate(() => {
    view = profileReturnView;
    render();
  });
}
let profileSaveTimer = null;
function saveProfileInfo(field, value) {
  if (!profileInfo[profile]) profileInfo[profile] = {};
  profileInfo[profile][field] = value;
  clearTimeout(profileSaveTimer);
  profileSaveTimer = setTimeout(saveProfileInfoNow, 400);
}

function goDetail(id) {
  const d = getDest(id);
  if (view === 'map') mapScrollY = window.scrollY;
  navigate(() => {
    detailReturnView = view === 'swipe' ? 'swipe' : 'map';
    region = d.country === 'Mexico' ? 'mexico' : 'usa';
    detailId = id;
    view = 'detail';
    openAddHighlight = false;
    openAddLodging = false;
    openItineraryDay = null;
    addingCity = null;
    selectedHighlightCity = d.cities ? d.cities[0] : null;
    window.scrollTo(0, 0);
    render();
    applyPendingScroll();
  }, id);
  loadPhotosFor(id).then(() => refreshDetailCard(id));
}
function refreshDetailCard(id) {
  if (view !== 'detail' || detailId !== id) return;
  const oldCard = document.querySelector('.detail-card');
  if (!oldCard) return;
  const d = getDest(id);
  const newCard = buildDetailCard(d, planOf(d));
  newCard.style.animation = 'none';
  oldCard.replaceWith(newCard);
}
function goMap() {
  const fromDetail = view === 'detail' ? detailId : null;
  navigate(() => {
    view = 'map';
    detailId = null;
    render();
    window.scrollTo(0, fromDetail ? mapScrollY : 0);
  }, fromDetail);
}
function deleteDestination(id) {
  const d = getDest(id);
  if (!window.confirm('¿Borrar ' + d.city + '? Esto no se puede deshacer.')) return;
  hiddenIds.push(id);
  goMap();
  saveState(['hiddenIds']).then(result => {
    if (result.ok) return;
    hiddenIds = hiddenIds.filter(x => x !== id);
    render();
    window.alert('No se guardó (' + result.detail + ') — revisa tu conexión e intenta borrar ' + d.city + ' otra vez.');
  });
}
function startMovingPin(id) {
  const d = getDest(id);
  if (!d) return;
  region = REGIONS.mexico.destinations.includes(d) ? 'mexico' : 'usa';
  movingPinId = id;
  view = 'map';
  render();
}
function toggleFavorite(id) {
  const d = getDest(id);
  d.favorite = !d.favorite;
  render();
}
function toggleElenyVisibility(id) {
  if (elenyHiddenIds.includes(id)) {
    elenyHiddenIds = elenyHiddenIds.filter(hid => hid !== id);
  } else {
    elenyHiddenIds.push(id);
  }
  render();
  saveState(['elenyHiddenIds']);
}
// ---- swipe to decide ----
let swipes = { luis: {}, eleny: {} }; // profile -> { destId: 'like' | 'nope' }
let pendingSwipes = {}; // my swipes still being saved, re-applied over any refresh
let swipeRound = 1; // shared round number, kept on the server
let swipeDragging = false;
let swipeRerender = false;
let detailReturnView = 'map';

function partnerName() { return profile === 'luis' ? 'Mich' : 'Luis'; }
function haptic(pattern) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* unsupported */ }
}
function txt(tag, className, text) {
  const node = el(tag, className);
  node.textContent = text;
  return node;
}

async function loadSwipes() {
  try {
    const res = await fetch('/api/swipes');
    if (!res.ok) return;
    const map = await res.json();
    swipes = { luis: map.luis || {}, eleny: map.eleny || {} };
    if (map.round) swipeRound = map.round;
    if (profile) Object.keys(pendingSwipes).forEach(id => { swipes[profile][id] = pendingSwipes[id]; });
  } catch (e) { /* keep what we have */ }
}
async function saveSwipe(destId, choice) {
  try {
    const res = await fetch('/api/swipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, destId, choice, city: (getDest(destId) || {}).city }),
      keepalive: true,
    });
    return res.ok;
  } catch (e) { return false; }
}
async function resetSwipes() {
  if (!window.confirm('¿Borrar todos los swipes de los dos y reiniciar desde la ronda 1? Esto no se puede deshacer.')) return;
  try {
    const res = await fetch('/api/swipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, resetAll: true }),
    });
    if (!res.ok) {
      window.alert('No se guardó (' + await describeFailure(res) + ') — revisa tu conexión e intenta de nuevo.');
      return;
    }
  } catch (e) {
    window.alert('No se guardó (' + await describeFailure(null, e) + ') — revisa tu conexión e intenta de nuevo.');
    return;
  }
  swipes = { luis: {}, eleny: {} };
  pendingSwipes = {};
  swipeRound = 1;
  haptic([20, 40, 20]);
  render();
}

// Elimination: a left swipe from either traveler takes a destination out for both.
// Anything hidden from Mich isn't in play at all.
// The same city added twice (e.g. a built-in and a "+ add city" copy) plays as one:
// the copy with the most info represents it, and a swipe on any copy counts for all.
function cityKey(d) {
  return (d.city || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase().replace(/\\s+/g, ' ').trim() + '|' + d.country;
}
function contentScore(d) {
  return (d.lodging || []).length * 2 + (destTotal(d) > 0 ? 2 : 0) + (d.vibe ? 1 : 0) + (d.custom ? 0 : 1);
}
function cityGroups() {
  const groups = new Map();
  allDestinations().filter(d => !hiddenIds.includes(d.id)).forEach(d => {
    const key = cityKey(d);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(d);
  });
  const repOf = {};
  const membersOf = {};
  groups.forEach(list => {
    const best = list.reduce((a, b) => (contentScore(b) > contentScore(a) ? b : a), list[0]);
    const ids = list.map(d => d.id);
    ids.forEach(id => { repOf[id] = best.id; });
    membersOf[best.id] = ids;
  });
  return { repOf, membersOf };
}
function groupIds(id) {
  const g = cityGroups();
  return g.membersOf[g.repOf[id]] || [id];
}
function isDuplicate(id) {
  const rep = cityGroups().repOf[id];
  return !!rep && rep !== id;
}
function swipeOf(who, id) {
  const ids = groupIds(id);
  if (ids.some(x => swipes[who][x] === 'nope')) return 'nope';
  return ids.some(x => swipes[who][x] === 'like') ? 'like' : null;
}
function inPlay(d) {
  return !hiddenIds.includes(d.id) && !elenyHiddenIds.includes(d.id) && !isDuplicate(d.id);
}
function isVetoed(id) {
  return swipeOf('luis', id) === 'nope' || swipeOf('eleny', id) === 'nope';
}
function isOut(id) {
  return groupIds(id).some(x => blockedIds.includes(x)) || isVetoed(id);
}
function swipeableDestinations() {
  return allDestinations().filter(d => inPlay(d) && !isOut(d.id));
}
function outDestinations() {
  return allDestinations().filter(d => inPlay(d) && isOut(d.id));
}
// Round done = more than one destination left and both said yes to all of them.
// The next round starts right away here; the server makes sure it only advances once.
function maybeAdvanceRound() {
  const alive = swipeableDestinations();
  if (alive.length < 2 || !alive.every(d => isMatch(d.id))) return false;
  const ids = [].concat(...alive.map(d => groupIds(d.id)));
  const fromRound = swipeRound;
  ids.forEach(id => { delete swipes.luis[id]; delete swipes.eleny[id]; });
  swipeRound = fromRound + 1;
  markMatchesSeen();
  fetch('/api/swipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, resetRound: ids, fromRound }),
    keepalive: true,
  }).then(res => res.json()).then(result => {
    if (result.advanced) { notifyPartner('round', String(result.round), alive.length); return; }
    // The other phone already started the next round.
    swipeRound = result.round || swipeRound;
    return loadSwipes().then(() => { if (view === 'swipe' && !swipeDragging) { swipeRerender = true; render(); } });
  }).catch(() => {});
  return true;
}

// ---- round intro screen ----
function roundSeenKey() { return 'seen-round-' + profile; }
function lastRoundSeen() {
  try { return Number(localStorage.getItem(roundSeenKey())) || 0; } catch (e) { return swipeRound; }
}
function markRoundSeen() {
  try { localStorage.setItem(roundSeenKey(), String(swipeRound)); } catch (e) { /* private mode */ }
}
// Shows the intro for the current round once per traveler (round 1 doubles as the game intro).
// entering: called while the swipe screen may still be mid-transition.
function maybeShowRoundIntro(entering) {
  if ((!entering && view !== 'swipe') || winnerId() || document.querySelector('.round-backdrop, .reveal-backdrop')) return false;
  if (lastRoundSeen() >= swipeRound) return false;
  showRoundIntro();
  return true;
}
function showRoundIntro() {
  markRoundSeen();
  const alive = swipeableDestinations();
  const isFinal = alive.length === 2;
  const backdrop = el('div', 'round-backdrop');
  backdrop.appendChild(el('div', 'round-rays'));
  const box = el('div', 'round-box');
  box.appendChild(txt('div', 'round-kicker', swipeRound === 1
    ? 'QUE EMPIECEN LOS JUEGOS'
    : 'LOS DOS DIJERON QUE SÍ A ' + alive.length));
  box.appendChild(txt('div', 'round-word', isFinal ? 'ÚLTIMA' : 'RONDA'));
  box.appendChild(txt('div', 'round-number' + (isFinal ? ' is-text' : ''), isFinal ? 'RONDA' : String(swipeRound)));
  box.appendChild(txt('div', 'round-sub', isFinal
    ? 'Solo quedan 2 — uno de los dos tiene que eliminar una.'
    : alive.length <= 3
    ? 'Últimas ' + alive.length + ' — esto se pone serio.'
    : alive.length + ' destinos siguen en juego'));
  const tiles = el('div', 'round-tiles');
  alive.slice(0, 10).forEach((d, i) => {
    const tile = txt('span', 'round-tile', d.city);
    tile.style.animationDelay = (0.9 + i * 0.07) + 's';
    tiles.appendChild(tile);
  });
  if (alive.length > 10) tiles.appendChild(txt('span', 'round-tile', '+' + (alive.length - 10) + ' más'));
  box.appendChild(tiles);
  const rules = el('div', 'round-rules');
  [['♥', 'Se queda'], ['✕', 'Fuera para los dos'], ['1º', 'Gana el que quede al final']].forEach(([icon, label], i) => {
    const rule = el('div', 'round-rule');
    rule.style.animationDelay = (1.3 + i * 0.1) + 's';
    rule.appendChild(txt('div', 'round-rule-icon', icon));
    rule.appendChild(txt('div', 'round-rule-label', label));
    rules.appendChild(rule);
  });
  box.appendChild(rules);
  const go = el('button', 'confirm-btn round-go', 'Vamos →');
  go.addEventListener('click', () => {
    haptic(15);
    backdrop.classList.add('leaving');
    setTimeout(() => backdrop.remove(), 280);
  });
  box.appendChild(go);
  backdrop.appendChild(box);
  document.body.appendChild(backdrop);
  haptic([30, 50, 30]);
}
function restoreDestination(id) {
  const d = getDest(id);
  if (!d || !window.confirm('¿Regresar ' + d.city + ' al juego?')) return;
  const ids = groupIds(id);
  ids.forEach(x => ['luis', 'eleny'].forEach(who => { if (swipes[who][x] === 'nope') delete swipes[who][x]; }));
  if (ids.some(x => blockedIds.includes(x))) {
    blockedIds = blockedIds.filter(b => !ids.includes(b));
    saveState(['blockedIds']);
  }
  ids.forEach(x => fetch('/api/swipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, restore: x }),
    keepalive: true,
  }).catch(() => {}));
  haptic(15);
  render();
}
function isMatch(id) {
  return swipeOf('luis', id) === 'like' && swipeOf('eleny', id) === 'like';
}
function currentMatchIds() {
  return swipeableDestinations().filter(d => isMatch(d.id)).map(d => d.id);
}
function seenMatchKey() { return 'seen-matches-' + profile; }
function getSeenMatches() {
  try { return JSON.parse(localStorage.getItem(seenMatchKey()) || '[]'); } catch (e) { return []; }
}
function markMatchesSeen() {
  try { localStorage.setItem(seenMatchKey(), JSON.stringify(currentMatchIds())); } catch (e) { /* private mode */ }
}
function unseenMatchIds() {
  const seen = getSeenMatches();
  return currentMatchIds().filter(id => !seen.includes(id));
}

function goSwipe() {
  const fromDetail = view === 'detail' ? detailId : null;
  navigate(() => {
    view = 'swipe';
    swipeRerender = false;
    window.scrollTo(0, 0);
    render();
  }, fromDetail);
  // The view switch may still be mid-transition when this resolves, so don't gate the match on it.
  loadSwipes().then(() => {
    maybeAdvanceRound();
    if (view === 'swipe' && !swipeDragging) { swipeRerender = true; render(); }
    if (maybeShowRoundIntro(true)) { markMatchesSeen(); return; }
    const unseen = unseenMatchIds();
    if (unseen.length) { showMatch(unseen[0]); markMatchesSeen(); }
  });
}

async function commitSwipe(id, choice) {
  swipes[profile][id] = choice;
  pendingSwipes[id] = choice;
  haptic(choice === 'like' ? 18 : 8);
  render();
  const ok = await saveSwipe(id, choice);
  delete pendingSwipes[id];

  if (choice === 'nope') {
    const d = getDest(id);
    const w = winnerId();
    if (w) {
      notifyPartner('winner', getDest(w).city, 0, w);
      setTimeout(() => showReveal(w), 350);
    } else {
      notifyPartner('city_cut', d ? d.city : '', swipeableDestinations().length, id);
    }
    return;
  }

  if (ok) await loadSwipes();
  if (maybeAdvanceRound()) {
    if (view === 'swipe' && !swipeDragging) render();
    maybeShowRoundIntro();
    return;
  }
  if (isMatch(id)) { showMatch(id); markMatchesSeen(); }
}

function flyOut(card, choice, id) {
  if (card.dataset.gone) return;
  card.dataset.gone = '1';
  const dir = choice === 'like' ? 1 : -1;
  const stamp = card.querySelector(choice === 'like' ? '.stamp-like' : '.stamp-nope');
  if (stamp) stamp.style.opacity = '1';
  card.style.transition = 'transform .34s ease-in, opacity .34s ease-in';
  card.style.transform = 'translate(' + (dir * window.innerWidth * 1.2) + 'px, 40px) rotate(' + (dir * 22) + 'deg)';
  card.style.opacity = '0';
  setTimeout(() => commitSwipe(id, choice), 260);
}

function attachSwipeDrag(card, id) {
  const likeStamp = card.querySelector('.stamp-like');
  const nopeStamp = card.querySelector('.stamp-nope');
  let startX = 0, startY = 0, dx = 0, dy = 0, active = false, pointerId = null;
  card.addEventListener('pointerdown', (e) => {
    if (card.dataset.gone || (e.button && e.button !== 0)) return;
    active = true;
    swipeDragging = true;
    pointerId = e.pointerId;
    startX = e.clientX; startY = e.clientY; dx = 0; dy = 0;
    try { card.setPointerCapture(pointerId); } catch (err) { /* ignore */ }
    card.style.transition = 'none';
  });
  card.addEventListener('pointermove', (e) => {
    if (!active || e.pointerId !== pointerId) return;
    dx = e.clientX - startX;
    dy = e.clientY - startY;
    card.style.transform = 'perspective(900px) translate(' + dx + 'px,' + (dy * 0.2) + 'px) rotate(' + (dx / 18) + 'deg) rotateY(' + Math.max(-18, Math.min(18, dx / 12)) + 'deg) rotateX(' + Math.max(-10, Math.min(10, -dy / 25)) + 'deg)';
    card.style.setProperty('--shine-x', (50 + dx / 3) + '%');
    card.style.setProperty('--shine-o', Math.min(Math.abs(dx) / 160, 0.7));
    const p = Math.min(Math.abs(dx) / 100, 1);
    likeStamp.style.opacity = dx > 0 ? p : 0;
    nopeStamp.style.opacity = dx < 0 ? p : 0;
  });
  function end(cancelled) {
    if (!active) return;
    active = false;
    swipeDragging = false;
    if (!cancelled && Math.abs(dx) < 6 && Math.abs(dy) < 6) { goDetail(id); return; }
    if (!cancelled && Math.abs(dx) > 100) { flyOut(card, dx > 0 ? 'like' : 'nope', id); return; }
    card.style.transition = 'transform .4s var(--ease-spring)';
    card.style.transform = '';
    card.style.setProperty('--shine-o', 0);
    likeStamp.style.opacity = 0;
    nopeStamp.style.opacity = 0;
  }
  card.addEventListener('pointerup', () => end(false));
  card.addEventListener('pointercancel', () => end(true));
}


function showMatch(id) {
  const d = getDest(id);
  if (!d) return;
  const plan = planOf(d);
  haptic([30, 60, 30, 60, 80]);
  const backdrop = el('div', 'match-backdrop');
  const shapes = ['●', '■', '▲', '◆'];
  const colors = ['#FF6B5B', '#0EA5A0', '#FFC93C', '#8A5FBF', '#FF6F91'];
  for (let i = 0; i < 40; i++) {
    const bit = txt('span', 'confetti-bit', shapes[i % shapes.length]);
    bit.style.color = colors[i % colors.length];
    bit.style.left = (Math.random() * 100) + '%';
    bit.style.animationDelay = (Math.random() * 0.9) + 's';
    bit.style.animationDuration = (2.2 + Math.random() * 1.8) + 's';
    bit.style.fontSize = (14 + Math.random() * 14) + 'px';
    backdrop.appendChild(bit);
  }
  const box = el('div', 'match-box');
  box.appendChild(avatarDuo());
  box.appendChild(txt('div', 'match-kicker', 'ES UN'));
  box.appendChild(txt('div', 'match-title', 'Match'));
  const photo = el('div', 'match-photo');
  photo.style.setProperty('--plan-color', plan.color);
  photo.style.setProperty('--plan-dim', plan.dim);
  if (d.cover) photo.style.backgroundImage = 'url("' + d.cover + '")';
  photo.appendChild(txt('div', 'match-photo-city', d.city));
  box.appendChild(photo);
  box.appendChild(txt('div', 'match-sub', 'Tú y ' + partnerName() + ' quieren ir a ' + d.city + '.'));
  const seeBtn = el('button', 'confirm-btn', 'Ver el viaje →');
  seeBtn.addEventListener('click', () => { backdrop.remove(); goDetail(id); });
  box.appendChild(seeBtn);
  const keepBtn = el('button', 'match-keep', 'Seguir deslizando');
  keepBtn.addEventListener('click', () => backdrop.remove());
  box.appendChild(keepBtn);
  backdrop.appendChild(box);
  document.body.appendChild(backdrop);
}

// ---- notifications ----
function notifyPartner(type, city, count, destId) {
  if (!profile) return;
  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: profile, type, city: city || '', count: count || 0, destId: destId || null }),
    keepalive: true,
  }).then(() => loadActivity()).catch(() => {});
}
function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent); }
function isStandalone() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
}
function pushSupported() { return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window; }
let pushSubscribed = false;
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js').then(reg => {
    if (!('PushManager' in window)) return;
    return reg.pushManager.getSubscription().then(sub => { pushSubscribed = !!sub; });
  }).catch(() => {});
  try { if (navigator.clearAppBadge) navigator.clearAppBadge(); } catch (e) { /* unsupported */ }
}
function urlBase64ToUint8Array(base64) {
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, c => c.charCodeAt(0));
}
async function enableNotifications() {
  if (!pushSupported()) {
    window.alert(isIOS() && !isStandalone()
      ? 'Abre ¿De aquí a dónde? desde el ícono en tu pantalla de inicio para activar las notificaciones.'
      : 'Este navegador no puede mostrar notificaciones.');
    return;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') { render(); return; }
    const reg = await navigator.serviceWorker.ready;
    const keyRes = await fetch('/api/push');
    const key = await keyRes.json();
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key.publicKey) });
    const res = await fetch('/api/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, subscription: sub.toJSON() }),
    });
    if (!res.ok) throw new Error('save failed');
    pushSubscribed = true;
    haptic(20);
    render();
  } catch (e) {
    window.alert('No se pudieron activar las notificaciones — intenta de nuevo en un momento.');
  }
}
function pushBannerDismissed() {
  try { return localStorage.getItem('push-banner-dismissed') === '1'; } catch (e) { return false; }
}
function dismissPushBanner() {
  try { localStorage.setItem('push-banner-dismissed', '1'); } catch (e) { /* private mode */ }
  render();
}
function shouldShowPushBanner() {
  return pushSupported() && Notification.permission === 'default' && !pushBannerDismissed();
}

// ---- trip dates & countdown ----
function parseDay(str) {
  const parts = str.split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}
function daysUntil(str) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseDay(str) - today) / 86400000);
}
function formatTripDate(str) {
  return parseDay(str).toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' });
}
function tripDayCount() {
  if (!tripStart || !tripEnd) return 3;
  const span = Math.round((parseDay(tripEnd) - parseDay(tripStart)) / 86400000) + 1;
  return Math.max(1, Math.min(14, span));
}
function dayDate(idx) {
  if (!tripStart) return null;
  const date = parseDay(tripStart);
  date.setDate(date.getDate() + idx);
  return date.toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' });
}
function setTripDate(field, value) {
  if (field === 'start') tripStart = value || null;
  else tripEnd = value || null;
  if (tripStart && tripEnd && tripEnd < tripStart) tripEnd = tripStart;
  saveState(['tripStart', 'tripEnd']).then(result => {
    if (result.ok) return;
    window.alert('No se guardó (' + result.detail + ') — revisa tu conexión e intenta de nuevo.');
  });
  if (tripStart) notifyPartner('trip_dates');
  render();
}
function setTripRange(start, end) {
  tripStart = start;
  tripEnd = end;
  saveState(['tripStart', 'tripEnd']).then(result => {
    if (result.ok) return;
    window.alert('No se guardó (' + result.detail + ') — revisa tu conexión e intenta de nuevo.');
  });
  notifyPartner('trip_dates');
  haptic([20, 40, 20]);
  render();
}
function resetTripDates() {
  if (!window.confirm('¿Borrar las fechas del viaje? Esto no se puede deshacer.')) return;
  tripStart = null;
  tripEnd = null;
  saveState(['tripStart', 'tripEnd']).then(result => {
    if (result.ok) return;
    window.alert('No se guardó (' + result.detail + ') — revisa tu conexión e intenta de nuevo.');
  });
  haptic([20, 40, 20]);
  render();
}

// ---- availability ("when I'm free") ----
// Stored per traveler in profileInfo[who].freeDays as 'YYYY-MM-DD' strings.
let calendarMonth = null; // Date on the 1st of the month being shown
let availabilityNotifyTimer = null;
function ymd(date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
}
function todayYmd() { return ymd(new Date()); }
function freeDaysOf(who) {
  const info = profileInfo[who] || {};
  return Array.isArray(info.freeDays) ? info.freeDays : [];
}
function setMyFreeDays(days) {
  const today = todayYmd();
  saveProfileInfo('freeDays', Array.from(new Set(days)).filter(day => day >= today).sort());
  clearTimeout(availabilityNotifyTimer);
  availabilityNotifyTimer = setTimeout(() => notifyPartner('availability'), 15000);
}
function sharedWindows() {
  const partner = profile === 'luis' ? 'eleny' : 'luis';
  const theirs = new Set(freeDaysOf(partner));
  const both = freeDaysOf(profile).filter(day => theirs.has(day) && day >= todayYmd()).sort();
  const windows = [];
  both.forEach(day => {
    const last = windows[windows.length - 1];
    if (last) {
      const next = parseDay(last.end);
      next.setDate(next.getDate() + 1);
      if (ymd(next) === day) { last.end = day; last.length++; return; }
    }
    windows.push({ start: day, end: day, length: 1 });
  });
  return windows.sort((a, b) => b.length - a.length || (a.start < b.start ? -1 : 1));
}
function formatShort(str) {
  return parseDay(str).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
}
function formatWindow(w) {
  return w.start === w.end ? formatShort(w.start) : formatShort(w.start) + ' – ' + formatShort(w.end);
}
function refreshAvailabilityCard() {
  const old = document.getElementById('availability');
  if (old) old.replaceWith(buildAvailabilityCard());
}
function buildAvailabilityCard() {
  const partner = profile === 'luis' ? 'eleny' : 'luis';
  const mine = new Set(freeDaysOf(profile));
  const theirs = new Set(freeDaysOf(partner));
  const today = todayYmd();
  if (!calendarMonth) {
    const base = tripStart ? parseDay(tripStart) : new Date();
    calendarMonth = new Date(base.getFullYear(), base.getMonth(), 1);
  }

  const card = el('div', 'add-city-form profile-info-card avail-card');
  card.id = 'availability';
  card.appendChild(el('div', 'add-city-label', 'CUÁNDO ESTOY LIBRE'));
  card.appendChild(txt('div', 'avail-hint', 'Toca o arrastra sobre los días en que puedes viajar. ' + partnerName() + ' también los ve.'));

  const nav = el('div', 'cal-nav');
  const prev = el('button', 'cal-arrow', '‹');
  prev.setAttribute('aria-label', 'Mes anterior');
  const thisMonth = new Date();
  const atFirst = calendarMonth.getFullYear() === thisMonth.getFullYear() && calendarMonth.getMonth() === thisMonth.getMonth();
  prev.disabled = atFirst;
  prev.addEventListener('click', () => { calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1); refreshAvailabilityCard(); });
  const next = el('button', 'cal-arrow', '›');
  next.setAttribute('aria-label', 'Mes siguiente');
  next.addEventListener('click', () => { calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1); refreshAvailabilityCard(); });
  nav.appendChild(prev);
  nav.appendChild(txt('div', 'cal-month', calendarMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })));
  nav.appendChild(next);
  card.appendChild(nav);

  const grid = el('div', 'cal-grid');
  ['D', 'L', 'M', 'M', 'J', 'V', 'S'].forEach(d => grid.appendChild(txt('div', 'cal-dow', d)));
  const first = calendarMonth.getDay();
  for (let i = 0; i < first; i++) grid.appendChild(el('div', 'cal-pad'));
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const key = ymd(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), dayNum));
    const isMine = mine.has(key);
    const isTheirs = theirs.has(key);
    const inTrip = tripStart && key >= tripStart && key <= (tripEnd || tripStart);
    const cls = 'cal-day' + (key < today ? ' is-past' : '') + (isMine ? ' is-mine' : '') + (isTheirs ? ' is-theirs' : '') + (isMine && isTheirs ? ' is-both' : '') + (inTrip ? ' is-trip' : '') + (key === today ? ' is-today' : '');
    const cell = txt('div', cls, String(dayNum));
    cell.dataset.day = key;
    grid.appendChild(cell);
  }
  attachCalendarPaint(grid, mine);
  card.appendChild(grid);

  const legend = el('div', 'cal-legend');
  legend.appendChild(txt('span', 'cal-key key-mine', 'Tú'));
  legend.appendChild(txt('span', 'cal-key key-theirs', partnerName()));
  legend.appendChild(txt('span', 'cal-key key-both', 'Ambos libres'));
  if (tripStart) legend.appendChild(txt('span', 'cal-key key-trip', 'Viaje'));
  card.appendChild(legend);

  const windows = sharedWindows().slice(0, 3);
  const box = el('div', 'avail-windows');
  if (windows.length) {
    box.appendChild(txt('div', 'avail-windows-title', 'Ambos están libres'));
    windows.forEach(w => {
      const row = el('div', 'avail-window');
      const info = el('div', 'avail-window-info');
      info.appendChild(txt('div', 'avail-window-dates', formatWindow(w)));
      info.appendChild(txt('div', 'avail-window-len', w.length + (w.length === 1 ? ' día' : ' días')));
      row.appendChild(info);
      const isCurrent = tripStart === w.start && (tripEnd || tripStart) === w.end;
      const use = el('button', 'avail-use' + (isCurrent ? ' is-set' : ''), isCurrent ? '✓ Fechas del viaje' : 'Usar estas fechas');
      if (!isCurrent) use.addEventListener('click', () => setTripRange(w.start, w.end));
      row.appendChild(use);
      box.appendChild(row);
    });
  } else if (!mine.size) {
    box.appendChild(txt('div', 'avail-empty', theirs.size
      ? partnerName() + ' marcó ' + theirs.size + (theirs.size === 1 ? ' día libre' : ' días libres') + ' — agrega los tuyos para encontrar el cruce.'
      : 'Marca tus días libres para empezar.'));
  } else if (!theirs.size) {
    box.appendChild(txt('div', 'avail-empty', 'Esperando a que ' + partnerName() + ' marque algunos días libres.'));
  } else {
    box.appendChild(txt('div', 'avail-empty', 'Todavía no hay cruce — intenta marcar más días.'));
  }
  card.appendChild(box);

  if (mine.size) {
    const clear = el('button', 'avail-clear', 'Borrar mis días');
    clear.addEventListener('click', () => {
      if (!window.confirm('¿Borrar todos los días que marcaste como libres?')) return;
      setMyFreeDays([]);
      refreshAvailabilityCard();
    });
    card.appendChild(clear);
  }
  return card;
}
// Tap toggles a day; dragging paints every day the finger crosses with the
// same add/remove as the first day touched.
function attachCalendarPaint(grid, mine) {
  let painting = null; // { adding: bool, days: Set }
  const dayAt = (x, y) => {
    const node = document.elementFromPoint(x, y);
    return node && node.classList && node.classList.contains('cal-day') && !node.classList.contains('is-past') ? node : null;
  };
  const paint = (cell) => {
    if (!cell || painting.days.has(cell.dataset.day)) return;
    painting.days.add(cell.dataset.day);
    cell.classList.toggle('is-mine', painting.adding);
    cell.classList.toggle('is-both', painting.adding && cell.classList.contains('is-theirs'));
    haptic(5);
  };
  grid.addEventListener('pointerdown', (e) => {
    const cell = dayAt(e.clientX, e.clientY);
    if (!cell) return;
    e.preventDefault();
    painting = { adding: !mine.has(cell.dataset.day), days: new Set() };
    try { grid.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    paint(cell);
  });
  grid.addEventListener('pointermove', (e) => {
    if (painting) paint(dayAt(e.clientX, e.clientY));
  });
  const finish = () => {
    if (!painting) return;
    const next = new Set(mine);
    painting.days.forEach(day => { if (painting.adding) next.add(day); else next.delete(day); });
    painting = null;
    setMyFreeDays(Array.from(next));
    refreshAvailabilityCard();
  };
  grid.addEventListener('pointerup', finish);
  grid.addEventListener('pointercancel', finish);
}

function tripCountdown() {
  if (!tripStart) return null;
  const days = daysUntil(tripStart);
  if (daysUntil(tripEnd || tripStart) < 0) return null;
  const w = winnerId();
  const place = w ? getDest(w).city : null;
  if (days > 1) return { big: String(days), label: 'días para ' + (place || 'nuestro viaje'), sub: formatTripDate(tripStart) };
  if (days === 1) return { big: '1', label: '¡día para ' + (place || 'nuestro viaje') + '!', sub: 'Prepara tu maleta' };
  if (days === 0) return { big: 'Hoy', label: '¡Hoy es el día!', sub: place ? 'Siguiente parada: ' + place : 'Que tengan el mejor viaje' };
  return { big: String(1 - days), label: '¡Disfruten ' + (place || 'el viaje') + '!', sub: 'Día ' + (1 - days) + ' de ' + tripDayCount() };
}

// ---- the final destination ----
// The last destination nobody has swiped out is the winner.
function winnerId() {
  const alive = swipeableDestinations();
  return alive.length === 1 ? alive[0].id : null;
}
function revealSeenKey() { return 'seen-winner-' + profile; }
function revealSeen(id) {
  try { return localStorage.getItem(revealSeenKey()) === id; } catch (e) { return true; }
}
function markRevealSeen(id) {
  try { localStorage.setItem(revealSeenKey(), id); } catch (e) { /* private mode */ }
}
function splitFlap(text) {
  const wrap = el('div', 'flap-text');
  const cells = [];
  text.toUpperCase().split(' ').forEach(word => {
    if (!word) return;
    const w = el('span', 'flap-word');
    Array.from(word).forEach(ch => {
      const cell = txt('span', 'flap-cell', ' ');
      cell.dataset.final = ch;
      w.appendChild(cell);
      cells.push(cell);
    });
    wrap.appendChild(w);
  });
  return { wrap, cells };
}
function runFlaps(cells, instant) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Promise.all(cells.map((cell, i) => new Promise(resolve => {
    if (instant) { cell.textContent = cell.dataset.final; cell.classList.add('settled'); resolve(); return; }
    let ticks = 0;
    const total = Math.min(30, 7 + i * 2);
    const timer = setInterval(() => {
      ticks++;
      if (ticks >= total) {
        clearInterval(timer);
        cell.textContent = cell.dataset.final;
        cell.classList.add('settled');
        resolve();
        return;
      }
      cell.textContent = letters[Math.floor(Math.random() * letters.length)];
    }, 55);
  })));
}
function confettiInto(container, count) {
  const shapes = ['●', '■', '▲', '◆'];
  const colors = ['#FF6B5B', '#0EA5A0', '#FFC93C', '#8A5FBF', '#FF6F91'];
  for (let i = 0; i < count; i++) {
    const bit = txt('span', 'confetti-bit', shapes[i % shapes.length]);
    bit.style.color = colors[i % colors.length];
    bit.style.left = (Math.random() * 100) + '%';
    bit.style.animationDelay = (Math.random() * 0.9) + 's';
    bit.style.animationDuration = (2.4 + Math.random() * 2) + 's';
    bit.style.fontSize = (14 + Math.random() * 16) + 'px';
    container.appendChild(bit);
  }
}
function bpField(label, value, extra) {
  const f = el('div', 'bp-field' + (extra ? ' ' + extra : ''));
  f.appendChild(txt('div', 'bp-label', label));
  f.appendChild(txt('div', 'bp-value', value));
  return f;
}
function showReveal(id) {
  const d = getDest(id);
  if (!d || document.querySelector('.reveal-backdrop')) return;
  markRevealSeen(id);
  const plan = planOf(d);
  const instant = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const backdrop = el('div', 'reveal-backdrop');
  const stage = el('div', 'reveal-stage');
  stage.appendChild(txt('div', 'reveal-kicker', 'TU PRÓXIMA AVENTURA ES…'));

  const pass = el('div', 'boarding-pass');
  pass.style.setProperty('--plan-color', plan.color);
  const top = el('div', 'bp-top');
  top.appendChild(txt('span', null, 'PASE DE ABORDAR'));
  top.appendChild(txt('span', null, '¿DE AQUÍ A DÓNDE?'));
  pass.appendChild(top);

  const body = el('div', 'bp-body');
  const route = el('div', 'bp-route');
  route.appendChild(bpField('DE', 'MX · US'));
  route.appendChild(txt('div', 'bp-plane', '→'));
  const toField = el('div', 'bp-field bp-to');
  toField.appendChild(txt('div', 'bp-label', 'A'));
  const code = splitFlap(d.code || d.city.slice(0, 3));
  code.wrap.classList.add('flap-code');
  toField.appendChild(code.wrap);
  route.appendChild(toField);
  body.appendChild(route);

  body.appendChild(txt('div', 'bp-label', 'DESTINO'));
  const city = splitFlap(d.city);
  city.wrap.classList.add('flap-city');
  body.appendChild(city.wrap);

  const meta = el('div', 'bp-meta');
  meta.appendChild(bpField('PASAJEROS', 'LUIS & MICH'));
  meta.appendChild(bpField('SALIDA', tripStart ? formatTripDate(tripStart).toUpperCase() : 'POR CONFIRMAR'));
  meta.appendChild(bpField('ASIENTO', 'JUNTOS', 'bp-seat'));
  body.appendChild(meta);
  pass.appendChild(body);
  pass.appendChild(txt('div', 'bp-stamp', 'CONFIRMADO'));
  stage.appendChild(pass);

  const photo = el('div', 'reveal-photo');
  photo.style.setProperty('--plan-color', plan.color);
  photo.style.setProperty('--plan-dim', plan.dim);
  if (d.cover) photo.style.backgroundImage = 'url("' + d.cover + '")';
  stage.appendChild(photo);
  const revealDuo = avatarDuo();
  revealDuo.classList.add('reveal-duo');
  stage.appendChild(revealDuo);

  const actions = el('div', 'reveal-actions');
  const planBtn = el('button', 'confirm-btn', 'Planear el viaje →');
  planBtn.addEventListener('click', () => {
    backdrop.remove();
    pendingScrollTo = 'itinerary';
    goDetail(id);
  });
  const closeBtn = el('button', 'match-keep', 'Cerrar');
  closeBtn.addEventListener('click', () => backdrop.remove());
  actions.appendChild(planBtn);
  actions.appendChild(closeBtn);
  stage.appendChild(actions);

  backdrop.appendChild(stage);
  document.body.appendChild(backdrop);
  haptic(15);

  setTimeout(() => {
    runFlaps(code.cells.concat(city.cells), instant).then(() => {
      pass.classList.add('confirmed');
      backdrop.classList.add('revealed');
      confettiInto(backdrop, 44);
      haptic([40, 60, 40, 60, 120]);
    });
  }, instant ? 0 : 700);
}

// ---- reactions on highlights ----
const REACTION_META = { love: '♥', maybe: '?', nope: '✕' };
let reactions = { luis: {}, eleny: {} };
function reactionKey(destId, name) { return destId + '|' + name; }
function reactionFor(who, destId, name) { return (reactions[who] || {})[reactionKey(destId, name)] || null; }
async function loadReactions() {
  try {
    const res = await fetch('/api/reactions');
    if (!res.ok) return;
    const map = await res.json();
    reactions = { luis: map.luis || {}, eleny: map.eleny || {} };
  } catch (e) { /* keep what we have */ }
}
function setReaction(destId, name, reaction) {
  const key = reactionKey(destId, name);
  if (reaction) reactions[profile][key] = reaction;
  else delete reactions[profile][key];
  haptic(10);
  closeReactionPicker();
  refreshDetailCard(destId);
  fetch('/api/reactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, destId, name, reaction, city: (getDest(destId) || {}).city }),
    keepalive: true,
  }).catch(() => {});
}
function closeReactionPicker() {
  document.querySelectorAll('.rx-picker').forEach(p => p.remove());
}
function openReactionPicker(anchor, destId, name) {
  const wasOpen = anchor.querySelector('.rx-picker');
  closeReactionPicker();
  if (wasOpen) return;
  const current = reactionFor(profile, destId, name);
  const picker = el('div', 'rx-picker');
  Object.keys(REACTION_META).forEach(r => {
    const b = txt('button', 'rx-option' + (current === r ? ' active' : ''), REACTION_META[r]);
    b.addEventListener('click', (e) => { e.stopPropagation(); setReaction(destId, name, current === r ? null : r); });
    picker.appendChild(b);
  });
  anchor.appendChild(picker);
  setTimeout(() => document.addEventListener('click', closeReactionPicker, { once: true }), 0);
}
function buildReactions(d, h) {
  const partner = profile === 'luis' ? 'eleny' : 'luis';
  const mine = reactionFor(profile, d.id, h.name);
  const theirs = reactionFor(partner, d.id, h.name);
  const box = el('div', 'rx');
  if (theirs) {
    const badge = txt('span', 'rx-partner', flagOf(partner) + REACTION_META[theirs]);
    badge.title = partnerName() + ' reaccionó';
    box.appendChild(badge);
  }
  const btn = txt('button', 'rx-mine' + (mine ? ' has' : ''), mine ? REACTION_META[mine] : '+');
  btn.setAttribute('aria-label', 'Reaccionar');
  btn.addEventListener('click', (e) => { e.stopPropagation(); openReactionPicker(box, d.id, h.name); });
  box.appendChild(btn);
  return box;
}

// ---- itinerary ----
let itineraries = {}; // destId -> [[{ name }], ...]
let openItineraryDay = null;
let pendingScrollTo = null;
function applyPendingScroll() {
  if (!pendingScrollTo) return;
  const target = document.getElementById(pendingScrollTo);
  pendingScrollTo = null;
  if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 16);
}
async function loadItineraries() {
  try {
    const res = await fetch('/api/itinerary');
    if (!res.ok) return;
    itineraries = (await res.json()) || {};
  } catch (e) { /* keep what we have */ }
}
function saveItinerary(destId) {
  fetch('/api/itinerary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destId, days: itineraries[destId] }),
    keepalive: true,
  }).catch(() => {});
}
function getItinerary(destId) {
  const days = (itineraries[destId] || []).map(day => day.slice());
  while (days.length < tripDayCount()) days.push([]);
  return days;
}
function itineraryHasStops(destId) {
  return (itineraries[destId] || []).some(day => day.length);
}
function highlightScore(destId, name) {
  const a = reactionFor('luis', destId, name);
  const b = reactionFor('eleny', destId, name);
  if (a === 'nope' || b === 'nope') return -1;
  return [a, b].reduce((sum, r) => sum + (r === 'love' ? 2 : r === 'maybe' ? 1 : 0), 0);
}
function updateItinerary(destId, days) {
  itineraries[destId] = days;
  saveItinerary(destId);
  refreshDetailCard(destId);
}
function autoPlan(destId) {
  const d = getDest(destId);
  if (itineraryHasStops(destId) && !window.confirm('¿Reemplazar el plan actual con uno automático?')) return;
  const ranked = d.highlights
    .map((h, i) => ({ name: h.name, score: highlightScore(destId, h.name), i }))
    .filter(x => x.score >= 0)
    .sort((x, y) => y.score - x.score || x.i - y.i);
  const days = Array.from({ length: tripDayCount() }, () => []);
  ranked.forEach((x, i) => {
    const day = days[i % days.length];
    if (day.length < 4) day.push({ name: x.name });
  });
  haptic(20);
  updateItinerary(destId, days);
  logActivity('', 'armó el plan automático para ' + d.city, destId);
}
function addStop(destId, dayIdx, name) {
  if (!name || !name.trim()) return;
  const days = getItinerary(destId);
  days[dayIdx].push({ name: name.trim() });
  openItineraryDay = null;
  updateItinerary(destId, days);
}
function removeStop(destId, dayIdx, stopIdx) {
  const days = getItinerary(destId);
  days[dayIdx].splice(stopIdx, 1);
  updateItinerary(destId, days);
}
function buildItinerary(d) {
  const section = el('div', 'detail-section itinerary');
  section.id = 'itinerary';
  section.appendChild(el('div', 'detail-label', 'ITINERARIO'));
  section.appendChild(txt('div', 'itin-sub', tripStart
    ? formatTripDate(tripStart) + (tripEnd && tripEnd !== tripStart ? ' → ' + formatTripDate(tripEnd) : '')
    : 'Pon las fechas de tu viaje en tu perfil (toca tu bandera) para ver fechas reales aquí.'));

  const autoBtn = el('button', 'itin-auto', 'Armar plan automático con tus reacciones');
  autoBtn.addEventListener('click', () => autoPlan(d.id));
  section.appendChild(autoBtn);

  const days = getItinerary(d.id);
  const planned = new Set();
  days.forEach(day => day.forEach(stop => planned.add(stop.name)));

  days.forEach((day, dayIdx) => {
    const dayCard = el('div', 'itin-day');
    const head = el('div', 'itin-day-head');
    head.appendChild(txt('span', 'itin-day-num', 'Día ' + (dayIdx + 1)));
    const date = dayDate(dayIdx);
    if (date) head.appendChild(txt('span', 'itin-day-date', date));
    dayCard.appendChild(head);

    if (!day.length) dayCard.appendChild(txt('div', 'itin-empty', 'Nada planeado todavía'));
    day.forEach((stop, stopIdx) => {
      const row = el('div', 'itin-stop');
      row.appendChild(txt('span', 'itin-stop-num', String(stopIdx + 1)));
      row.appendChild(txt('span', 'itin-stop-name', stop.name));
      const both = reactionFor('luis', d.id, stop.name) === 'love' && reactionFor('eleny', d.id, stop.name) === 'love';
      if (both) row.appendChild(txt('span', 'itin-stop-love', '♥ ♥'));
      const del = el('button', 'highlight-del', '×');
      del.addEventListener('click', () => removeStop(d.id, dayIdx, stopIdx));
      row.appendChild(del);
      dayCard.appendChild(row);
    });

    if (openItineraryDay === dayIdx) {
      const suggestions = d.highlights
        .map((h, i) => ({ name: h.name, score: highlightScore(d.id, h.name), i }))
        .filter(x => x.score >= 0 && !planned.has(x.name))
        .sort((x, y) => y.score - x.score || x.i - y.i)
        .slice(0, 6);
      if (suggestions.length) {
        const chips = el('div', 'itin-suggest');
        suggestions.forEach(x => {
          const chip = txt('button', 'itin-chip', (x.score >= 3 ? '♥ ' : x.score >= 2 ? '+ ' : '') + x.name);
          chip.addEventListener('click', () => addStop(d.id, dayIdx, x.name));
          chips.appendChild(chip);
        });
        dayCard.appendChild(chips);
      }
      const form = el('div', 'add-form');
      const input = document.createElement('input');
      input.placeholder = 'O escribe lo que sea (cena, día de playa…)';
      const addBtn = el('button', null, 'Agregar');
      addBtn.addEventListener('click', () => addStop(d.id, dayIdx, input.value));
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addStop(d.id, dayIdx, input.value); });
      form.appendChild(input);
      form.appendChild(addBtn);
      dayCard.appendChild(form);
    } else {
      const addRow = el('div', 'add-row', '+ agregar parada');
      addRow.addEventListener('click', () => { openItineraryDay = dayIdx; refreshDetailCard(d.id); });
      dayCard.appendChild(addRow);
    }
    section.appendChild(dayCard);
  });
  return section;
}

// ---- transitions & live sync ----
let mapScrollY = 0;
// Runs a screen change inside a View Transition when the browser supports it;
// the element tagged data-morph="<id>" in the old and new screen morphs between them.
function navigate(update, morphId) {
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduced) { update(); return; }
  const tag = (node) => { if (node) node.style.viewTransitionName = 'dest-morph'; };
  if (morphId) tag(document.querySelector('[data-morph="' + morphId + '"]'));
  document.documentElement.classList.add('vt-running');
  const transition = document.startViewTransition(() => {
    update();
    if (morphId) tag(document.querySelector('[data-morph="' + morphId + '"]'));
  });
  transition.finished.finally(() => {
    document.documentElement.classList.remove('vt-running');
    document.querySelectorAll('[data-morph]').forEach(node => { node.style.viewTransitionName = ''; });
  });
}
let lastSyncAt = Date.now();
async function syncFromServer() {
  await Promise.all([loadSwipes(), loadReactions(), loadItineraries(), loadActivity(), loadPriorities()]);
  await loadCustomDestinations();
  maybeAdvanceRound();
  if (view === 'swipe') setTimeout(maybeShowRoundIntro, 50);
  if (swipeDragging || document.querySelector('.reveal-backdrop, .match-backdrop, .rx-picker, .lightbox-backdrop')) return;
  if (view === 'map' || view === 'swipe') { swipeRerender = true; render(); }
  else if (view === 'detail' && detailId) refreshDetailCard(detailId);
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  try { if (navigator.clearAppBadge) navigator.clearAppBadge(); } catch (e) { /* unsupported */ }
  if (!profile || Date.now() - lastSyncAt < 4000) return;
  lastSyncAt = Date.now();
  syncFromServer();
  loadWeather();
});

// ---- avatars (flag-initial badge — no 3D engine) ----
function flagOf(who) { return who === 'luis' ? 'L' : 'E'; }
function avatarThumbNode(who, cls) {
  const node = txt('div', 'avatar-thumb' + (cls ? ' ' + cls : ''), flagOf(who));
  node.dataset.avatarThumb = who;
  return node;
}
function avatarDuo() {
  const duo = el('div', 'avatar-duo');
  duo.appendChild(avatarThumbNode('luis'));
  duo.appendChild(avatarThumbNode('eleny'));
  return duo;
}

// ---- home bases & flight routes ----
let placingHome = false;
let mapIntroPlayed = false; // pin drop / route draw-in play only the first time the map shows
function homeOf(who) {
  const info = profileInfo[who] || {};
  return info.home && info.home.region ? info.home : null;
}
function startPlacingHome() {
  placingHome = true;
  addingCity = null;
  movingPinId = null;
  render();
}
function setHome(x, y) {
  placingHome = false;
  saveProfileInfo('home', { region, x, y });
  haptic([15, 30, 15]);
  render();
}
// Arcs go to the winner, or else to this round's matches.
function routeTargets() {
  const w = winnerId();
  if (w) return [w];
  return currentMatchIds().slice(0, 4);
}
const ROUTE_COLORS = { luis: '#FF6B5B', eleny: '#2EC4B6' };
const PLANE_PATH = 'M-11,-1.6 L3,-1.6 L9,0 L3,1.6 L-11,1.6 Z M-3,-1.6 L-7,-10 L-3.5,-10 L3,-1.6 Z M-3,1.6 L-7,10 L-3.5,10 L3,1.6 Z M-11,-1.6 L-13,-5 L-10.5,-5 L-8,-1.6 Z M-11,1.6 L-13,5 L-10.5,5 L-8,1.6 Z';
function svgEl(tag, attrs) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.keys(attrs).forEach(k => node.setAttribute(k, attrs[k]));
  return node;
}
// Arcs from each traveler's home to the winner (or matches, or Luis's top pick).
// A home on the other country's map enters from the edge facing that country.
function buildRoutes(r, stageDests, intro) {
  const dims = r.aspect.split('/').map(v => parseFloat(v));
  const w = dims[0], h = dims[1];
  const scale = w / 900;
  const svg = svgEl('svg', { class: 'route-layer', viewBox: '0 0 ' + w + ' ' + h, preserveAspectRatio: 'xMidYMid meet' });
  const targets = routeTargets().map(getDest).filter(d => d && stageDests.includes(d));
  let n = 0;
  ['luis', 'eleny'].forEach(who => {
    const home = homeOf(who);
    if (!home) return;
    targets.forEach(t => {
      const bx = t.pin.x / 100 * w, by = t.pin.y / 100 * h;
      let ax, ay;
      if (home.region === region) { ax = home.x / 100 * w; ay = home.y / 100 * h; }
      else if (region === 'mexico') { ax = bx * 0.7 + w * 0.15; ay = -40 * scale; }
      else { ax = bx * 0.6 + w * 0.1; ay = h + 40 * scale; }
      const dx = bx - ax, dy = by - ay;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 20 * scale) return;
      let px = -dy / dist, py = dx / dist;
      if (py > 0) { px = -px; py = -py; }
      const bend = Math.min(dist * 0.28, 160 * scale);
      const cx = (ax + bx) / 2 + px * bend, cy = (ay + by) / 2 + py * bend;
      const d = 'M' + ax.toFixed(1) + ',' + ay.toFixed(1) + ' Q' + cx.toFixed(1) + ',' + cy.toFixed(1) + ' ' + bx.toFixed(1) + ',' + by.toFixed(1);
      const delay = (n * 0.35).toFixed(2);
      const g = svgEl('g', { class: 'route' });
      g.style.setProperty('--route-color', ROUTE_COLORS[who]);
      const glow = svgEl('path', { d, class: 'route-glow', pathLength: '1', 'stroke-width': (7 * scale).toFixed(1) });
      if (intro) glow.style.animationDelay = delay + 's';
      const dash = svgEl('path', { d, class: 'route-dash', 'stroke-width': (2.8 * scale).toFixed(1), 'stroke-dasharray': (9 * scale).toFixed(1) + ' ' + (8 * scale).toFixed(1) });
      if (intro) dash.style.animationDelay = (parseFloat(delay) + 0.7).toFixed(2) + 's, 0s';
      dash.style.setProperty('--dash-cycle', (17 * scale).toFixed(1));
      const shade = svgEl('path', { d, class: 'route-shade', 'stroke-width': (5 * scale).toFixed(1) });
      if (intro) shade.style.animationDelay = (parseFloat(delay) + 0.7).toFixed(2) + 's';
      g.appendChild(glow);
      g.appendChild(shade);
      g.appendChild(dash);
      const plane = svgEl('g', { class: 'route-plane', opacity: '0' });
      plane.appendChild(svgEl('path', { d: PLANE_PATH, transform: 'scale(' + (1.35 * scale).toFixed(2) + ')' }));
      const dur = (3.2 + dist / (600 * scale)).toFixed(2) + 's';
      const begin = (intro ? parseFloat(delay) + 0.9 : n * 0.35).toFixed(2) + 's';
      plane.appendChild(svgEl('animateMotion', { path: d, dur, begin, repeatCount: 'indefinite', rotate: 'auto', calcMode: 'spline', keyTimes: '0;1', keySplines: '0.45 0 0.25 1' }));
      plane.appendChild(svgEl('animate', { attributeName: 'opacity', values: '0;1;1;0', keyTimes: '0;0.08;0.88;1', dur, begin, repeatCount: 'indefinite' }));
      g.appendChild(plane);
      svg.appendChild(g);
      n++;
    });
  });
  return svg;
}
function buildHomePins() {
  const pins = [];
  ['luis', 'eleny'].forEach(who => {
    const home = homeOf(who);
    if (!home || home.region !== region) return;
    const pin = el('div', 'home-pin');
    pin.style.left = home.x + '%';
    pin.style.top = home.y + '%';
    pin.style.setProperty('--route-color', ROUTE_COLORS[who]);
    pin.appendChild(el('div', 'home-pin-pulse'));
    pin.appendChild(avatarThumbNode(who, 'home-pin-flag'));
    pin.title = who === profile ? 'Tu base' : 'La base de ' + (who === 'luis' ? 'Luis' : 'Mich');
    pins.push(pin);
  });
  return pins;
}

// ---- activity feed ----
let activity = [];
let activityOpen = false;
async function loadActivity() {
  try {
    const res = await fetch('/api/activity');
    if (!res.ok) return;
    const list = await res.json();
    if (Array.isArray(list)) activity = list;
  } catch (e) { /* keep what we have */ }
}
function logActivity(emoji, text, destId) {
  if (!profile) return;
  activity.unshift({ id: 'local-' + Date.now(), profile, emoji, text, destId: destId || null, at: Date.now() });
  fetch('/api/activity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, emoji, text, destId: destId || null }),
    keepalive: true,
  }).catch(() => {});
}
function activitySeenKey() { return 'activity-seen-' + profile; }
function lastSeenActivity() {
  try { return Number(localStorage.getItem(activitySeenKey())) || 0; } catch (e) { return Date.now(); }
}
function markActivitySeen() {
  try { localStorage.setItem(activitySeenKey(), String(Date.now())); } catch (e) { /* private mode */ }
}
function timeAgo(ms) {
  const sec = Math.max(0, (Date.now() - ms) / 1000);
  if (sec < 60) return 'justo ahora';
  if (sec < 3600) return 'hace ' + Math.floor(sec / 60) + 'm';
  if (sec < 86400) return 'hace ' + Math.floor(sec / 3600) + 'h';
  if (sec < 7 * 86400) return 'hace ' + Math.floor(sec / 86400) + 'd';
  return new Date(ms).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
}
function buildActivityItem(item) {
  const row = el('div', 'activity-item' + (item.destId && getDest(item.destId) ? ' is-link' : ''));
  if (item.profile === 'luis' || item.profile === 'eleny') {
    row.appendChild(avatarThumbNode(item.profile, 'activity-emoji has-avatar'));
  }
  const body = el('div', 'activity-body');
  const line = el('div', 'activity-text');
  if (item.profile !== 'both') line.appendChild(txt('strong', null, (item.profile === profile ? 'Tú' : (item.profile === 'luis' ? 'Luis' : 'Mich')) + ' '));
  line.appendChild(document.createTextNode(item.text));
  body.appendChild(line);
  body.appendChild(txt('div', 'activity-time', timeAgo(item.at)));
  row.appendChild(body);
  if (item.destId && getDest(item.destId)) row.addEventListener('click', () => goDetail(item.destId));
  return row;
}
function buildActivityCard() {
  if (!activity.length) return null;
  const seen = lastSeenActivity();
  const unread = activity.filter(a => a.profile !== profile && a.at > seen).length;
  const card = el('div', 'activity-card' + (activityOpen ? ' open' : ''));
  card.id = 'activity';
  const head = el('button', 'activity-head');
  head.appendChild(txt('span', 'activity-title', 'Novedades'));
  if (unread) head.appendChild(txt('span', 'activity-badge', unread + ' nuevas'));
  head.appendChild(txt('span', 'activity-chevron', '⌄'));
  head.addEventListener('click', () => {
    activityOpen = !activityOpen;
    if (activityOpen) markActivitySeen();
    haptic(8);
    const old = document.getElementById('activity');
    const fresh = buildActivityCard();
    if (old && fresh) old.replaceWith(fresh);
  });
  card.appendChild(head);
  const list = el('div', 'activity-list');
  activity.slice(0, activityOpen ? 15 : 1).forEach(item => list.appendChild(buildActivityItem(item)));
  card.appendChild(list);
  return card;
}

// ---- live weather (Open-Meteo, no key needed) ----
const DEST_COORDS = {
  cdmx: [19.4326, -99.1332], cabo: [22.8905, -109.9167], gdl: [20.6597, -103.3496], pvr: [20.6534, -105.2253],
  bajio: [20.9144, -100.7452], tahoe: [38.9399, -119.9772], vegas: [36.1699, -115.1398], austin: [30.2672, -97.7431],
  miami: [25.7617, -80.1918], sandiego: [32.7157, -117.1611],
};
let weather = {}; // destId -> { temp (°C), code, isDay, tz }
let weatherLoadedAt = 0;
let geoCache = {};
try { geoCache = JSON.parse(localStorage.getItem('geo-cache') || '{}'); } catch (e) { geoCache = {}; }
async function coordsFor(d) {
  if (DEST_COORDS[d.id]) return DEST_COORDS[d.id];
  const key = d.city + '|' + d.country;
  if (key in geoCache) return geoCache[key];
  try {
    const res = await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&format=json&countryCode='
      + (d.country === 'Mexico' ? 'MX' : 'US') + '&name=' + encodeURIComponent(d.city.split('/')[0].trim()));
    if (!res.ok) return null;
    const json = await res.json();
    const hit = json.results && json.results[0];
    geoCache[key] = hit ? [hit.latitude, hit.longitude] : null;
    try { localStorage.setItem('geo-cache', JSON.stringify(geoCache)); } catch (e) { /* private mode */ }
    return geoCache[key];
  } catch (e) { return null; }
}
async function loadWeather(force) {
  if (!force && Date.now() - weatherLoadedAt < 15 * 60 * 1000) return;
  weatherLoadedAt = Date.now();
  try {
    const dests = allDestinations().filter(d => !hiddenIds.includes(d.id));
    const coords = await Promise.all(dests.map(coordsFor));
    const located = dests.map((d, i) => ({ d, c: coords[i] })).filter(x => x.c);
    if (!located.length) return;
    const res = await fetch('https://api.open-meteo.com/v1/forecast?current=temperature_2m,weather_code,is_day&timezone=auto'
      + '&latitude=' + located.map(x => x.c[0]).join(',') + '&longitude=' + located.map(x => x.c[1]).join(','));
    if (!res.ok) { weatherLoadedAt = 0; return; }
    let data = await res.json();
    if (!Array.isArray(data)) data = [data];
    data.forEach((row, i) => {
      if (!row || !row.current || !located[i]) return;
      weather[located[i].d.id] = { temp: row.current.temperature_2m, code: row.current.weather_code, isDay: row.current.is_day === 1, tz: row.timezone };
    });
    paintWeather();
  } catch (e) { weatherLoadedAt = 0; }
}
function weatherLabel(code) {
  if (code === 0) return 'Despejado';
  if (code <= 2) return 'Parcialmente nublado';
  if (code === 3) return 'Nublado';
  if (code === 45 || code === 48) return 'Neblina';
  if (code >= 51 && code <= 67) return 'Lluvioso';
  if (code >= 71 && code <= 86 && !(code >= 80 && code <= 82)) return 'Nevado';
  if (code >= 80 && code <= 82) return 'Chubascos';
  if (code >= 95) return 'Tormentoso';
  return '';
}
// °F for Mich, °C for Luis.
function formatTemp(c) {
  return profile === 'eleny' ? Math.round(c * 9 / 5 + 32) + '°F' : Math.round(c) + '°C';
}
function localTimeIn(tz) {
  try { return new Date().toLocaleTimeString('es-MX', { hour: 'numeric', minute: '2-digit', timeZone: tz }); } catch (e) { return ''; }
}
function weatherShort(id) {
  const w = weather[id];
  return w ? formatTemp(w.temp) : '';
}
function weatherLong(id) {
  const w = weather[id];
  if (!w) return '';
  const time = w.tz ? localTimeIn(w.tz) : '';
  return formatTemp(w.temp) + ' · ' + weatherLabel(w.code) + (time ? ' · ' + time + ' allá' : '');
}
function weatherNode(tag, cls, id, long) {
  const node = txt(tag, cls, long ? weatherLong(id) : weatherShort(id));
  node.dataset.weatherFor = id;
  node.dataset.weatherLong = long ? '1' : '';
  if (!weather[id]) node.classList.add('is-empty');
  return node;
}
function paintWeather() {
  document.querySelectorAll('[data-weather-for]').forEach(node => {
    const id = node.dataset.weatherFor;
    if (!weather[id]) return;
    node.textContent = node.dataset.weatherLong ? weatherLong(id) : weatherShort(id);
    node.classList.remove('is-empty');
  });
}

// ---- sky by time of day ----
function skyPhase() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 17) return 'day';
  if (hour >= 17 && hour < 20) return 'dusk';
  return 'night';
}
// Delays are derived from the clock so clouds keep drifting smoothly across re-renders.
function buildSky(phase) {
  const fx = el('div', 'sky-fx');
  const now = Date.now() / 1000;
  [{ top: 8, dur: 95, size: 1 }, { top: 26, dur: 130, size: 1.4 }, { top: 58, dur: 110, size: 0.9 }, { top: 78, dur: 150, size: 1.2 }].forEach((c, i) => {
    const cloud = el('div', 'cloud');
    cloud.style.top = c.top + '%';
    cloud.style.transform = 'scale(' + c.size + ')';
    cloud.style.animationDuration = c.dur + 's';
    cloud.style.animationDelay = (-((now + i * 37) % c.dur)) + 's';
    fx.appendChild(cloud);
  });
  if (phase === 'night') {
    fx.appendChild(el('div', 'stars stars-a'));
    fx.appendChild(el('div', 'stars stars-b'));
  }
  return fx;
}

// ---- count-up numbers ----
function countUp(node, to, format, duration) {
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !(to > 0)) { node.textContent = format(to); return; }
  const start = performance.now();
  const dur = duration || 900;
  node.textContent = format(0);
  const step = (t) => {
    const p = Math.min(1, (t - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    node.textContent = format(Math.round(to * eased));
    if (p < 1 && node.isConnected) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
let lastCountdownShown = null;
let lastPriceAnimatedFor = null;

// ---- pull to refresh (home-screen app only; Safari has its own) ----
function setupPullToRefresh() {
  let startY = null, pull = 0, indicator = null, refreshing = false;
  const reset = () => { if (indicator) indicator.remove(); indicator = null; startY = null; pull = 0; };
  document.addEventListener('touchstart', (e) => {
    startY = null;
    if (!isStandalone() || refreshing || window.scrollY > 0 || !profile || view === 'intro' || view === 'splash') return;
    if (document.querySelector('.reveal-backdrop, .match-backdrop, .lightbox-backdrop')) return;
    if (e.target.closest && e.target.closest('.swipe-card, .cal-grid, .map-stage')) return;
    startY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (startY === null) return;
    const dy = e.touches[0].clientY - startY;
    if (dy <= 0 || window.scrollY > 0) { if (indicator) { indicator.remove(); indicator = null; } pull = 0; return; }
    pull = Math.min(dy * 0.5, 120);
    if (!indicator) {
      indicator = el('div', 'ptr');
      indicator.appendChild(txt('span', 'ptr-plane', '▲'));
      document.body.appendChild(indicator);
    }
    indicator.style.transform = 'translate(-50%, ' + (pull - 46) + 'px) rotate(' + (pull * 2.6) + 'deg)';
    const ready = pull > 72;
    if (ready && !indicator.classList.contains('ready')) haptic(10);
    indicator.classList.toggle('ready', ready);
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (startY === null || !indicator) { reset(); return; }
    if (pull <= 72) { reset(); return; }
    startY = null;
    refreshing = true;
    const node = indicator;
    node.classList.add('spinning');
    lastSyncAt = Date.now();
    Promise.all([syncFromServer(), loadActivity(), loadWeather(true)]).finally(() => {
      node.classList.add('done');
      setTimeout(() => { node.remove(); if (indicator === node) indicator = null; refreshing = false; }, 450);
      if (view === 'map') { swipeRerender = true; render(); }
    });
  });
}

function addHighlight(id, text) {
  const d = getDest(id);
  if (text && text.trim()) {
    d.highlights.push({ name: text.trim(), photo: null, city: d.cities ? selectedHighlightCity : null });
    saveHighlights(id);
  }
  openAddHighlight = false;
  render();
}
function removeHighlight(id, idx) {
  const d = getDest(id);
  const h = d.highlights[idx];
  d.highlights.splice(idx, 1);
  render();
  saveHighlights(id);
  if (h.photo) savePhoto(photoKeyForHighlight(id, h.name), null);
}
function setHighlightPhoto(id, idx) {
  pickPhoto(dataUrl => {
    const d = getDest(id);
    const h = d.highlights[idx];
    const previous = h.photo;
    h.photo = dataUrl;
    render();
    savePhoto(photoKeyForHighlight(id, h.name), dataUrl).then(ok => {
      if (ok) return;
      h.photo = previous;
      render();
      window.alert('Esa foto no se guardó — revisa tu conexión e intenta de nuevo.');
    });
  });
}
function setCoverPhoto(id) {
  pickPhoto(dataUrl => {
    const d = getDest(id);
    const previous = d.cover;
    d.cover = dataUrl;
    render();
    savePhoto(photoKeyForCover(id), dataUrl).then(ok => {
      if (ok) { logActivity('', 'agregó una foto de portada de ' + d.city, id); return; }
      d.cover = previous;
      render();
      window.alert('Esa foto no se guardó — revisa tu conexión e intenta de nuevo.');
    });
  });
}
function setLodgingPhoto(id, idx) {
  pickPhoto(dataUrl => {
    const d = getDest(id);
    const l = d.lodging[idx];
    const previous = l.photo;
    l.photo = dataUrl;
    render();
    savePhoto(photoKeyForLodging(id, l.name), dataUrl).then(ok => {
      if (ok) return;
      l.photo = previous;
      render();
      window.alert('Esa foto no se guardó — revisa tu conexión e intenta de nuevo.');
    });
  });
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}
function appTitle() {
  return el('div', 'app-title', '🌵 ¿De aquí a dónde? <span class="app-title-icon">🌁</span>');
}

function renderIntro() {
  const view_ = el('div', 'view');

  const introTitle = appTitle();
  introTitle.classList.add('intro-title');
  view_.appendChild(introTitle);

  const hero = document.createElement('img');
  hero.className = 'intro-hero';
  hero.src = INTRO_HERO_IMG;
  hero.alt = 'Mich y Luis';
  view_.appendChild(hero);

  const header = el('div');
  header.style.textAlign = 'center';
  header.appendChild(el('h1', null, '¿A dónde <em>nos escapamos</em>?'));
  view_.appendChild(header);

  const chooseLabel = el('div', 'sub', 'Elige quién eres');
  chooseLabel.style.textAlign = 'center';
  chooseLabel.style.marginTop = '4px';
  view_.appendChild(chooseLabel);

  const select = el('div', 'profile-select');

  const luisCard = el('div', 'profile-card');
  luisCard.appendChild(avatarThumbNode('luis'));
  luisCard.appendChild(el('div', 'profile-name', 'Luis'));
  luisCard.appendChild(el('div', 'profile-hint', 'requiere contraseña'));
  luisCard.addEventListener('click', () => selectProfile('luis'));
  select.appendChild(luisCard);

  const elenyCard = el('div', 'profile-card');
  elenyCard.appendChild(avatarThumbNode('eleny'));
  elenyCard.appendChild(el('div', 'profile-name', 'Mich'));
  elenyCard.appendChild(el('div', 'profile-hint', 'toca para entrar'));
  elenyCard.addEventListener('click', () => selectProfile('eleny'));
  select.appendChild(elenyCard);

  view_.appendChild(select);

  return view_;
}

function renderMap() {
  const view_ = el('div', 'view');
  view_.appendChild(appTitle());

  const countdown = tripCountdown();
  const winner = winnerId() ? getDest(winnerId()) : null;
  if (countdown) {
    const cd = el('button', 'countdown-card');
    const big = txt('div', 'countdown-big', countdown.big);
    const bigNum = Number(countdown.big);
    if (bigNum > 0 && lastCountdownShown !== countdown.big) countUp(big, bigNum, v => String(v), 1100);
    lastCountdownShown = countdown.big;
    cd.appendChild(big);
    const cdText = el('div', 'countdown-text');
    cdText.appendChild(txt('div', 'countdown-label', countdown.label));
    cdText.appendChild(txt('div', 'countdown-sub', countdown.sub));
    cd.appendChild(cdText);
    cd.addEventListener('click', () => { if (winner) goDetail(winner.id); else goProfile(); });
    view_.appendChild(cd);
  }

  if (!tripStart) {
    const myDays = freeDaysOf(profile).length;
    const theirDays = freeDaysOf(profile === 'luis' ? 'eleny' : 'luis').length;
    const best = sharedWindows()[0];
    const nudgeText = best
      ? 'Ambos están libres ' + formatWindow(best) + ' — ¿confirmamos las fechas?'
      : !myDays && theirDays
      ? partnerName() + ' marcó algunos días libres — agrega los tuyos'
      : !myDays
      ? 'Marca las fechas en que puedes viajar'
      : null;
    if (nudgeText) {
      const nudge = txt('button', 'avail-nudge', nudgeText);
      nudge.addEventListener('click', () => { pendingScrollTo = 'availability'; goProfile(); });
      view_.appendChild(nudge);
    }
  }

  if (shouldShowPushBanner()) {
    const banner = el('div', 'push-banner');
    banner.appendChild(txt('div', 'push-banner-text', 'Recibe un aviso cuando ' + partnerName() + ' deslice, haga match o agregue una ciudad'));
    const onBtn = el('button', 'push-banner-on', 'Activar');
    onBtn.addEventListener('click', enableNotifications);
    const offBtn = el('button', 'push-banner-x', '×');
    offBtn.setAttribute('aria-label', 'Cerrar');
    offBtn.addEventListener('click', dismissPushBanner);
    banner.appendChild(onBtn);
    banner.appendChild(offBtn);
    view_.appendChild(banner);
  }

  const toSwipe = swipeableDestinations().filter(d => !swipeOf(profile, d.id)).length;
  const newMatches = unseenMatchIds().length;
  const swipeBtn = el('button', 'swipe-cta', 'Deslizar · Ronda ' + swipeRound);
  if (newMatches) swipeBtn.appendChild(txt('span', 'swipe-cta-badge is-match', newMatches + (newMatches > 1 ? ' matches nuevos' : ' match nuevo') + '!'));
  else if (toSwipe) swipeBtn.appendChild(txt('span', 'swipe-cta-badge', toSwipe + ' por deslizar'));
  swipeBtn.addEventListener('click', goSwipe);
  if (!winner) view_.appendChild(swipeBtn);

  if (winner) {
    const winBtn = el('button', 'winner-cta');
    winBtn.appendChild(txt('span', null, 'Ya se decidió: ' + winner.city));
    winBtn.appendChild(txt('span', 'winner-cta-sub', 'Toca para la revelación'));
    winBtn.addEventListener('click', () => showReveal(winner.id));
    view_.appendChild(winBtn);
    if (!revealSeen(winner.id)) setTimeout(() => { if (view === 'map' && !revealSeen(winner.id)) showReveal(winner.id); }, 600);
  }

  const activityCard = buildActivityCard();
  if (activityCard) view_.appendChild(activityCard);

  const tabs = el('div', 'region-tabs');
  Object.keys(REGIONS).forEach(key => {
    const btn = el('button', 'region-tab' + (region === key ? ' active' : ''), REGIONS[key].label);
    btn.addEventListener('click', () => { region = key; render(); });
    tabs.appendChild(btn);
  });
  view_.appendChild(tabs);

  const r = { ...REGIONS[region], destinations: REGIONS[region].destinations.filter(d => !isOut(d.id) && !hiddenIds.includes(d.id) && !isDuplicate(d.id) && (isAdmin || !elenyHiddenIds.includes(d.id))) };

  const mapCard = el('div', 'map-card');
  const stage = el('div', 'map-stage' + ((addingCity && addingCity.step === 'pin') || movingPinId || placingHome ? ' placing' : ''));
  stage.style.aspectRatio = r.aspect;
  if (addingCity && addingCity.step === 'pin') {
    stage.addEventListener('click', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      addingCity = { step: 'form', pin: { x, y } };
      render();
    });
  } else if (movingPinId) {
    stage.addEventListener('click', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const d = getDest(movingPinId);
      d.pin = { x, y };
      movingPinId = null;
      render();
      saveCustomDestinations(region);
    });
  } else if (placingHome) {
    stage.addEventListener('click', (e) => {
      const rect = stage.getBoundingClientRect();
      setHome(((e.clientX - rect.left) / rect.width) * 100, ((e.clientY - rect.top) / rect.height) * 100);
    });
  }

  if (r.type === 'image') {
    const img = document.createElement('img');
    img.className = 'map-img';
    img.src = r.src;
    img.alt = 'Mapa de ' + r.label;
    stage.appendChild(img);
  } else {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'map-svg');
    svg.setAttribute('viewBox', r.viewBox);
    svg.setAttribute('preserveAspectRatio', 'none');
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', r.path);
    svg.appendChild(path);
    stage.appendChild(svg);
  }

  const intro = !mapIntroPlayed;
  mapIntroPlayed = true;
  if (intro) stage.classList.add('map-intro');
  stage.appendChild(buildRoutes(r, r.destinations, intro));
  buildHomePins().forEach(pin => stage.appendChild(pin));

  r.destinations.forEach((d, pinIdx) => {
    const plan = planOf(d);
    const hiddenFromEleny = isAdmin && elenyHiddenIds.includes(d.id);
    const pin = el('button', 'pin' + (hiddenFromEleny ? ' pin-eleny-hidden' : ''));
    pin.style.left = d.pin.x + '%';
    pin.style.top = d.pin.y + '%';
    pin.style.setProperty('--plan-color', plan.color);
    const dotWrap = el('div', 'pin-dot-wrap');
    dotWrap.appendChild(el('div', 'pin-ring'));
    dotWrap.appendChild(el('div', 'pin-dot'));
    if (d.favorite) dotWrap.appendChild(el('div', 'pin-star', '★'));
    if (intro) dotWrap.style.animationDelay = (0.25 + pinIdx * 0.07) + 's';
    pin.appendChild(dotWrap);
    pin.addEventListener('click', () => goDetail(d.id));
    stage.appendChild(pin);
  });

  if (addingCity && addingCity.step === 'form') {
    const previewPin = el('div', 'pin pin-preview');
    previewPin.style.left = addingCity.pin.x + '%';
    previewPin.style.top = addingCity.pin.y + '%';
    const dotWrap = el('div', 'pin-dot-wrap');
    dotWrap.appendChild(el('div', 'pin-dot'));
    previewPin.appendChild(dotWrap);
    stage.appendChild(previewPin);
  }

  mapCard.appendChild(stage);
  mapCard.appendChild(el('div', 'map-hint', addingCity && addingCity.step === 'pin'
    ? 'Toca el mapa donde va esta ciudad'
    : movingPinId
    ? 'Toca el mapa para mover este pin'
    : placingHome
    ? 'Toca desde dónde volarás o manejarás'
    : 'Toca cualquier pin para ver la propuesta completa'));
  if (!addingCity && !movingPinId) {
    const homeBtn = el('button', 'home-chip' + (placingHome ? ' is-cancel' : ''), placingHome
      ? 'Cancelar'
      : homeOf(profile) ? 'Mover mi base' : 'Pon tu base para ver las rutas de vuelo');
    homeBtn.addEventListener('click', () => { if (placingHome) { placingHome = false; render(); } else startPlacingHome(); });
    mapCard.appendChild(homeBtn);
  }

  if (movingPinId) {
    const cancelMoveRow = el('button', 'add-city-row', 'Cancelar mover pin');
    cancelMoveRow.addEventListener('click', () => { movingPinId = null; render(); });
    view_.appendChild(cancelMoveRow);
  }

  const plansUsed = [...new Set(r.destinations.map(d => d.plan))];
  const legend = el('div', 'legend');
  plansUsed.forEach(planKey => {
    const meta = PLAN_META[planKey];
    const item = el('div', 'legend-item');
    item.style.setProperty('--plan-color', meta.color);
    item.appendChild(el('div', 'legend-swatch'));
    item.appendChild(document.createTextNode(meta.label));
    legend.appendChild(item);
  });
  mapCard.appendChild(legend);
  view_.appendChild(mapCard);

  const list = el('div', 'dest-list');
  r.destinations.forEach((d, idx) => {
    const plan = planOf(d);
    const hiddenFromEleny = isAdmin && elenyHiddenIds.includes(d.id);
    const row = el('div', 'dest-row' + (winnerId() === d.id ? ' is-top-pick' : '') + (hiddenFromEleny ? ' is-eleny-hidden' : '') + (isAdmin ? ' has-vis-toggle' : '') + (d.cover ? ' has-cover' : ''));
    row.style.animationDelay = (idx * 0.04) + 's';
    row.style.setProperty('--plan-color', plan.color);
    row.dataset.coverFor = d.id;
    row.dataset.coverShade = '1';
    row.dataset.morph = d.id;
    if (d.cover) row.style.backgroundImage = coverBackground(d, true);
    const left = el('div', 'dest-row-left');
    left.appendChild(el('div', 'dest-row-name', d.city));
    if (d.note) left.appendChild(el('div', 'dest-row-note', d.note));
    left.appendChild(weatherNode('div', 'dest-row-weather', d.id, false));
    if (hiddenFromEleny) left.appendChild(el('div', 'dest-row-note', 'Oculto para Mich'));
    row.appendChild(left);
    const right = el('div', 'dest-row-right');
    if (d.favorite) right.appendChild(el('span', 'dest-row-heart', '♥'));
    if (isMatch(d.id)) right.appendChild(el('span', 'dest-row-heart', '♥'));
    if (isAdmin) right.appendChild(el('div', 'dest-row-price', money(destTotal(d))));
    row.appendChild(right);
    if (isAdmin) {
      const visBtn = el('button', 'dest-row-visibility', hiddenFromEleny ? 'Oculto' : 'Visible');
      visBtn.setAttribute('aria-label', hiddenFromEleny ? 'Mostrar a Mich' : 'Ocultar de Mich');
      visBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleElenyVisibility(d.id); });
      row.appendChild(visBtn);
    }
    row.addEventListener('click', () => goDetail(d.id));
    list.appendChild(row);
  });
  view_.appendChild(list);

  if (addingCity && addingCity.step === 'form') {
    const form = el('div', 'add-city-form');
    form.appendChild(el('div', 'add-city-label', 'Nombre de la nueva ciudad'));
    const input = document.createElement('input');
    input.placeholder = 'ej. Oaxaca';
    form.appendChild(input);

    form.appendChild(el('div', 'add-city-label', 'Tipo'));
    const planPicker = el('div', 'add-city-plans');
    let chosenPlan = 'city';
    Object.keys(PLAN_META).forEach(planKey => {
      const meta = PLAN_META[planKey];
      const btn = el('button', 'city-tab' + (planKey === chosenPlan ? ' active' : ''), meta.label);
      btn.addEventListener('click', () => {
        chosenPlan = planKey;
        planPicker.querySelectorAll('.city-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      planPicker.appendChild(btn);
    });
    form.appendChild(planPicker);

    const actions = el('div', 'add-city-actions');
    const cancelBtn = el('button', 'add-city-cancel-btn', 'Cancelar');
    cancelBtn.addEventListener('click', () => { addingCity = null; render(); });
    const addBtn = el('button', 'add-city-add-btn', 'Agregar ciudad');
    addBtn.addEventListener('click', () => addCustomDestination(input.value, chosenPlan));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addCustomDestination(input.value, chosenPlan); });
    actions.appendChild(cancelBtn);
    actions.appendChild(addBtn);
    form.appendChild(actions);

    view_.appendChild(form);
  } else if (addingCity && addingCity.step === 'pin') {
    const cancelRow = el('button', 'add-city-row', 'Cancelar agregar ciudad');
    cancelRow.addEventListener('click', () => { addingCity = null; render(); });
    view_.appendChild(cancelRow);
  } else {
    const addCityRow = el('div', 'add-city-row', '+ agregar ciudad');
    addCityRow.addEventListener('click', () => { addingCity = { step: 'pin' }; render(); });
    view_.appendChild(addCityRow);
  }

  prefetchCovers(r.destinations.map(d => d.id));

  return view_;
}

function buildSwipeCard(d, tier) {
  // tier: 0 = top (draggable), 1 = next (peeking), 2 = back (deep in the stack)
  const plan = planOf(d);
  const tierClass = tier === 0 ? 'is-top' : tier === 1 ? 'is-next' : 'is-back';
  const card = el('div', 'swipe-card ' + tierClass);
  card.dataset.coverFor = d.id;
  if (tier === 0) card.dataset.morph = d.id;
  card.style.setProperty('--plan-color', plan.color);
  card.style.setProperty('--plan-dim', plan.dim);
  if (d.cover) card.style.backgroundImage = coverBackground(d, false);
  else card.classList.add('no-cover');
  if (tier < 2) {
    card.appendChild(el('div', 'swipe-shine'));
    card.appendChild(weatherNode('div', 'swipe-weather', d.id, false));
    card.appendChild(txt('div', 'swipe-stamp stamp-like', 'VAMOS'));
    card.appendChild(txt('div', 'swipe-stamp stamp-nope', 'FUERA'));
  }
  const info = el('div', 'swipe-card-info');
  info.appendChild(txt('div', 'swipe-card-meta', plan.label + ' · ' + countryLabel(d.country)));
  info.appendChild(txt('div', 'swipe-card-city', d.city));
  if (tier === 0 && d.vibe) info.appendChild(txt('div', 'swipe-card-vibe', d.vibe));
  if (tier === 0 && d.highlights.length) {
    const chips = el('div', 'swipe-chips');
    d.highlights.slice(0, 3).forEach(h => chips.appendChild(txt('span', 'swipe-chip', h.name)));
    info.appendChild(chips);
  }
  card.appendChild(info);
  return card;
}

function renderSwipe() {
  const view_ = el('div', 'view swipe-view' + (swipeRerender ? ' no-anim' : ''));
  swipeRerender = true;
  view_.appendChild(appTitle());

  const backBtn = el('button', 'back-btn', '← Volver al mapa');
  backBtn.addEventListener('click', goMap);
  view_.appendChild(backBtn);

  view_.appendChild(el('h1', null, '¿Tú <em>irías</em>?'));
  view_.appendChild(txt('p', 'sub', 'Derecha si irías. Izquierda y queda fuera — para los dos. El último que quede es a donde van.'));

  const all = swipeableDestinations();
  const deck = all.filter(d => !swipeOf(profile, d.id));
  const matches = all.filter(d => isMatch(d.id));
  const out = outDestinations();
  const winner = winnerId() ? getDest(winnerId()) : null;

  if (winner) {
    const done = el('div', 'swipe-done is-winner');
    done.appendChild(txt('div', 'swipe-done-emoji', '★'));
    done.appendChild(txt('div', 'swipe-done-title', winner.city));
    done.appendChild(txt('div', 'swipe-done-sub', 'El último que queda — este es.'));
    const planBtn = el('button', 'confirm-btn', 'Planear el viaje →');
    planBtn.addEventListener('click', () => { pendingScrollTo = 'itinerary'; goDetail(winner.id); });
    done.appendChild(planBtn);
    const replay = el('button', 'match-keep', 'Ver la revelación');
    replay.addEventListener('click', () => showReveal(winner.id));
    done.appendChild(replay);
    view_.appendChild(done);
  } else if (deck.length) {
    const cardIdx = all.length - deck.length + 1;
    view_.appendChild(txt('div', 'swipe-progress', (all.length === 2 ? 'RONDA FINAL' : 'RONDA ' + swipeRound)
      + ' · QUEDAN ' + all.length + ' · TARJETA ' + cardIdx + ' DE ' + all.length));
    const progressBar = el('div', 'swipe-progress-bar');
    const progressFill = el('div', 'swipe-progress-fill');
    progressFill.style.width = (cardIdx / all.length * 100) + '%';
    progressBar.appendChild(progressFill);
    view_.appendChild(progressBar);
    const deckWrap = el('div', 'swipe-deck');
    if (deck[2]) deckWrap.appendChild(buildSwipeCard(deck[2], 2));
    if (deck[1]) deckWrap.appendChild(buildSwipeCard(deck[1], 1));
    const top = buildSwipeCard(deck[0], 0);
    deckWrap.appendChild(top);
    attachSwipeDrag(top, deck[0].id);
    view_.appendChild(deckWrap);

    const actions = el('div', 'swipe-actions');
    const nopeBtn = el('button', 'swipe-btn swipe-btn-nope', '✕');
    nopeBtn.setAttribute('aria-label', 'Eliminar');
    nopeBtn.addEventListener('click', () => flyOut(top, 'nope', deck[0].id));
    const infoBtn = el('button', 'swipe-btn swipe-btn-info', 'i');
    infoBtn.setAttribute('aria-label', 'Ver detalles');
    infoBtn.addEventListener('click', () => goDetail(deck[0].id));
    const likeBtn = el('button', 'swipe-btn swipe-btn-like', '♥');
    likeBtn.setAttribute('aria-label', 'Vamos');
    likeBtn.addEventListener('click', () => flyOut(top, 'like', deck[0].id));
    actions.appendChild(nopeBtn);
    actions.appendChild(infoBtn);
    actions.appendChild(likeBtn);
    view_.appendChild(actions);
  } else {
    const done = el('div', 'swipe-done');
    done.appendChild(txt('div', 'swipe-done-emoji', '○'));
    done.appendChild(txt('div', 'swipe-done-title', '¡Ronda ' + swipeRound + ' lista de tu lado!'));
    done.appendChild(txt('div', 'swipe-done-sub', 'Esperando a que ' + partnerName() + ' termine — luego empieza la siguiente ronda con todo a lo que ambos dijeron que sí.'));
    view_.appendChild(done);
  }

  const matchBox = el('div', 'swipe-matches');
  matchBox.appendChild(txt('div', 'swipe-matches-label', 'LOS DOS DIJERON QUE SÍ' + (matches.length ? ' (' + matches.length + ')' : '')));
  if (matches.length) {
    const row = el('div', 'swipe-matches-row');
    matches.forEach(d => {
      const plan = planOf(d);
      const chip = el('button', 'match-chip');
      chip.style.setProperty('--plan-color', plan.color);
      chip.style.setProperty('--plan-dim', plan.dim);
      chip.dataset.coverFor = d.id;
      chip.dataset.morph = d.id;
      if (d.cover) chip.style.backgroundImage = coverBackground(d, false);
      chip.appendChild(txt('span', 'match-chip-city', d.city));
      chip.addEventListener('click', () => goDetail(d.id));
      row.appendChild(chip);
    });
    matchBox.appendChild(row);
  } else {
    matchBox.appendChild(txt('div', 'swipe-matches-empty', 'Nada todavía — sigue deslizando'));
  }
  if (!winner) view_.appendChild(matchBox);

  if (out.length) {
    const outBox = el('div', 'swipe-out');
    outBox.appendChild(txt('div', 'swipe-matches-label', 'FUERA (' + out.length + ')'));
    const row = el('div', 'swipe-out-row');
    out.forEach(d => {
      const chip = txt('button', 'out-chip', d.city + ' ↺');
      chip.setAttribute('aria-label', 'Regresar ' + d.city);
      chip.addEventListener('click', () => restoreDestination(d.id));
      row.appendChild(chip);
    });
    outBox.appendChild(row);
    outBox.appendChild(txt('div', 'swipe-out-hint', '¿Eliminaste una por error? Tócala para regresarla.'));
    view_.appendChild(outBox);
  }

  prefetchCovers(deck.slice(0, 3).map(d => d.id).concat(matches.map(d => d.id)));
  return view_;
}

function renderProfile() {
  const view_ = el('div', 'view');
  view_.appendChild(appTitle());

  const backBtn = el('button', 'back-btn', '← Volver');
  backBtn.addEventListener('click', backFromProfile);
  view_.appendChild(backBtn);

  const header = el('div', 'profile-header');
  header.appendChild(avatarThumbNode(profile, 'profile-header-flag'));
  header.appendChild(el('div', 'profile-header-name', profile === 'luis' ? 'Luis' : 'Mich'));
  view_.appendChild(header);

  const switchBtn = el('button', 'add-city-row', '↺ Cambiar a ' + (profile === 'luis' ? 'Mich' : 'Luis'));
  switchBtn.addEventListener('click', goIntro);
  view_.appendChild(switchBtn);

  view_.appendChild(buildAvailabilityCard());

  const tripCard = el('div', 'add-city-form profile-info-card');
  tripCard.appendChild(el('div', 'add-city-label', 'FECHAS DEL VIAJE'));
  const dateRow = el('div', 'trip-dates');
  [['start', 'Salida', tripStart], ['end', 'Regreso', tripEnd]].forEach(([field, label, value]) => {
    const wrap = el('label', 'trip-date');
    wrap.appendChild(txt('span', 'add-city-label', label));
    const input = document.createElement('input');
    input.type = 'date';
    input.value = value || '';
    if (field === 'end' && tripStart) input.min = tripStart;
    input.addEventListener('change', () => setTripDate(field, input.value));
    wrap.appendChild(input);
    dateRow.appendChild(wrap);
  });
  tripCard.appendChild(dateRow);
  tripCard.appendChild(txt('div', 'trip-dates-hint', 'Se comparte con ' + partnerName() + ' — activa la cuenta regresiva en el mapa.'));
  view_.appendChild(tripCard);

  const notifCard = el('div', 'add-city-form profile-info-card');
  notifCard.appendChild(el('div', 'add-city-label', 'NOTIFICACIONES'));
  const perm = pushSupported() ? Notification.permission : 'unsupported';
  if (pushSubscribed && perm === 'granted') {
    notifCard.appendChild(txt('div', 'notif-status is-on', '✓ Activadas — recibirás un aviso cuando ' + partnerName() + ' deslice, haga match o agregue una ciudad.'));
  } else if (perm === 'denied') {
    notifCard.appendChild(txt('div', 'notif-status', 'Bloqueadas. Actívalas en Configuración de tu teléfono → Notificaciones → ¿De aquí a dónde?.'));
  } else if (perm === 'unsupported') {
    notifCard.appendChild(txt('div', 'notif-status', isIOS() && !isStandalone()
      ? 'Agrega ¿De aquí a dónde? a tu pantalla de inicio, ábrela desde ahí y vuelve aquí.'
      : 'Este navegador no soporta notificaciones.'));
  } else {
    const onBtn = el('button', 'confirm-btn', 'Activar notificaciones');
    onBtn.addEventListener('click', enableNotifications);
    notifCard.appendChild(onBtn);
  }
  view_.appendChild(notifCard);

  const info = profileInfo[profile] || {};

  const card = el('div', 'add-city-form profile-info-card');
  card.appendChild(el('div', 'add-city-label', 'EN CASO DE EMERGENCIA'));

  const fields = [
    { key: 'contactName', label: 'Nombre del contacto de emergencia', placeholder: 'ej. Mamá — Carmen Rangel' },
    { key: 'contactPhone', label: 'Teléfono del contacto de emergencia', placeholder: '+52 555 000 0000' },
  ];
  fields.forEach(f => {
    card.appendChild(el('div', 'add-city-label', f.label));
    const input = document.createElement('input');
    input.value = info[f.key] || '';
    input.placeholder = f.placeholder;
    input.addEventListener('input', () => saveProfileInfo(f.key, input.value));
    card.appendChild(input);
  });

  card.appendChild(el('div', 'add-city-label', 'Tipo de sangre'));
  const bloodSelect = document.createElement('select');
  bloodSelect.className = 'blood-type-select';
  const bloodOptions = ['', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  bloodOptions.forEach(opt => {
    const optEl = document.createElement('option');
    optEl.value = opt;
    optEl.textContent = opt || 'Selecciona…';
    if ((info.bloodType || '') === opt) optEl.selected = true;
    bloodSelect.appendChild(optEl);
  });
  bloodSelect.addEventListener('change', () => saveProfileInfo('bloodType', bloodSelect.value));
  card.appendChild(bloodSelect);

  card.appendChild(el('div', 'add-city-label', 'Alergias / notas médicas'));
  const textarea = document.createElement('textarea');
  textarea.className = 'profile-textarea';
  textarea.value = info.allergies || '';
  textarea.placeholder = 'ej. Penicilina, mariscos…';
  textarea.addEventListener('input', () => saveProfileInfo('allergies', textarea.value));
  card.appendChild(textarea);

  view_.appendChild(card);

  if (isAdmin) {
    const adminCard = el('div', 'add-city-form profile-info-card');
    adminCard.appendChild(el('div', 'add-city-label', 'ADMIN'));
    adminCard.appendChild(txt('div', 'avail-hint', 'Borra todos los swipes de los dos y vuelve a empezar desde la ronda 1.'));
    const resetBtn = el('button', 'delete-city-btn', 'Reiniciar el swipe');
    resetBtn.addEventListener('click', resetSwipes);
    adminCard.appendChild(resetBtn);
    adminCard.appendChild(txt('div', 'avail-hint', 'Borra las fechas del viaje que ya se pusieron.'));
    const resetDatesBtn = el('button', 'delete-city-btn', 'Reiniciar fechas del viaje');
    resetDatesBtn.addEventListener('click', resetTripDates);
    adminCard.appendChild(resetDatesBtn);
    view_.appendChild(adminCard);
  }

  return view_;
}

function renderDetail() {
  const view_ = el('div', 'view');
  const d = getDest(detailId);
  const plan = planOf(d);
  view_.appendChild(appTitle());

  const backBtn = el('button', 'back-btn', detailReturnView === 'swipe' ? '← Volver a deslizar' : '← Volver al mapa');
  backBtn.addEventListener('click', detailReturnView === 'swipe' ? goSwipe : goMap);
  view_.appendChild(backBtn);

  view_.appendChild(buildDetailCard(d, plan));

  return view_;
}

function buildDetailCard(d, plan) {
  const photosReady = loadedPhotoDestIds.has(d.id);
  const card = el('div', 'detail-card');
  card.style.setProperty('--plan-color', plan.color);
  card.style.setProperty('--plan-dim', plan.dim);
  card.style.setProperty('--plan-soft1', hexToRgba(plan.color, 0.32));
  card.style.setProperty('--plan-soft2', hexToRgba(plan.dim, 0.22));

  if (!d.cover) card.dataset.morph = d.id;
  if (d.cover) {
    const hero = el('div', 'detail-cover');
    hero.dataset.morph = d.id;
    hero.style.backgroundImage = 'url("' + d.cover + '")';
    hero.addEventListener('click', () => showPhotoLightbox(d.cover, d.city, () => setCoverPhoto(d.id)));
    const changeBtn = el('button', 'detail-cover-change', 'Cambiar');
    changeBtn.addEventListener('click', (e) => { e.stopPropagation(); setCoverPhoto(d.id); });
    hero.appendChild(changeBtn);
    card.appendChild(hero);
  } else if (!photosReady) {
    card.appendChild(el('div', 'detail-cover skeleton'));
  } else {
    const addCover = el('button', 'detail-cover-add', 'Agregar foto de portada');
    addCover.addEventListener('click', () => setCoverPhoto(d.id));
    card.appendChild(addCover);
  }

  const photoHighlights = d.highlights.map((h, idx) => ({ h, idx })).filter(x => x.h.photo);
  const photoLodging = (d.lodging || []).map((l, idx) => ({ l, idx })).filter(x => x.l.photo);
  if (photoHighlights.length > 0 || photoLodging.length > 0) {
    const gallery = el('div', 'gallery');
    gallery.appendChild(el('div', 'gallery-label', 'FOTOS'));
    const scroller = el('div', 'gallery-scroll');
    photoHighlights.forEach(({ h, idx }) => {
      const img = document.createElement('img');
      img.className = 'gallery-thumb';
      img.src = h.photo;
      img.alt = h.name;
      img.addEventListener('click', () => showPhotoLightbox(h.photo, h.name, () => setHighlightPhoto(d.id, idx)));
      scroller.appendChild(img);
    });
    photoLodging.forEach(({ l, idx }) => {
      const img = document.createElement('img');
      img.className = 'gallery-thumb';
      img.src = l.photo;
      img.alt = l.name;
      img.addEventListener('click', () => showPhotoLightbox(l.photo, l.name, () => setLodgingPhoto(d.id, idx)));
      scroller.appendChild(img);
    });
    gallery.appendChild(scroller);
    card.appendChild(gallery);
  }

  const head = el('div', 'detail-head');
  const headLeft = el('div', 'detail-head-left');
  headLeft.appendChild(el('div', 'detail-city', d.city));
  if (winnerId() === d.id) headLeft.appendChild(txt('div', 'admin-pick-banner is-top-pick', 'Nuestro destino'));
  headLeft.appendChild(el('div', 'detail-country', countryLabel(d.country)));
  headLeft.appendChild(weatherNode('div', 'detail-weather', d.id, true));
  headLeft.appendChild(el('div', 'detail-plan-chip', plan.label));
  if (d.note) headLeft.appendChild(el('div', 'detail-note', d.note));
  head.appendChild(headLeft);
  head.appendChild(el('div', 'detail-code', d.code));
  card.appendChild(head);

  if (d.vibe) card.appendChild(el('p', 'detail-vibe', d.vibe));

  if (isAdmin) {
    const priceBlock = el('div', 'price-block');
    priceBlock.appendChild(el('div', 'price-total-label', 'TOTAL ESTIMADO (solo tú ves esto)'));
    const totalEl = el('div', 'price-total', money(destTotal(d)));
    if (lastPriceAnimatedFor !== d.id) { lastPriceAnimatedFor = d.id; countUp(totalEl, destTotal(d), money, 900); }
    priceBlock.appendChild(totalEl);

    const currentCosts = (d.costs && d.costs.myTransport != null) ? d.costs : EMPTY_COSTS;
    const costFields = [
      { key: 'myTransport', label: 'Mi transporte' },
      { key: 'elenyTransport', label: 'Transporte de Mich' },
      { key: 'gas', label: 'Gasolina' },
      { key: 'tolls', label: 'Casetas' },
      { key: 'hotel', label: 'Hotel / Airbnb' },
    ];
    const costGrid = el('div', 'cost-grid');
    costFields.forEach(f => {
      const field = el('div', 'cost-field');
      field.appendChild(el('div', 'cost-field-label', f.label));
      const input = document.createElement('input');
      input.type = 'number';
      input.inputMode = 'decimal';
      input.min = '0';
      input.value = currentCosts[f.key] || '';
      input.placeholder = '0';
      input.addEventListener('input', () => {
        setCostField(d.id, f.key, input.value);
        totalEl.textContent = money(destTotal(d));
      });
      field.appendChild(input);
      costGrid.appendChild(field);
    });
    priceBlock.appendChild(costGrid);
    card.appendChild(priceBlock);
  }

  if (winnerId() === d.id || itineraryHasStops(d.id)) card.appendChild(buildItinerary(d));

  const section = el('div', 'detail-section');
  section.appendChild(el('div', 'detail-label', 'LO DESTACADO'));
  section.appendChild(txt('div', 'rx-hint', 'Toca + para reaccionar — ' + partnerName() + ' también lo ve.'));

  if (d.cities) {
    const cityTabs = el('div', 'city-tabs');
    d.cities.forEach(cityName => {
      const tab = el('button', 'city-tab' + (selectedHighlightCity === cityName ? ' active' : ''), cityName);
      tab.addEventListener('click', () => { selectedHighlightCity = cityName; render(); });
      cityTabs.appendChild(tab);
    });
    section.appendChild(cityTabs);
  }

  // Highlights added before this destination had city tabs have no city
  // set — keep showing those under every tab instead of hiding them.
  const matchesCity = h => !d.cities || !h.city || h.city === selectedHighlightCity;

  const visibleHighlights = d.highlights.filter(matchesCity);
  if (visibleHighlights.length === 0 && !openAddHighlight) {
    section.appendChild(el('div', 'highlight-empty', 'Todavía no hay nada agregado.'));
  }

  const highlightsBox = el('div', 'highlights');
  d.highlights.forEach((h, idx) => {
    if (!matchesCity(h)) return;
    const row = el('div', 'highlight-row');
    row.style.animationDelay = (idx * 0.05) + 's';
    if (h.photo) {
      const img = document.createElement('img');
      img.className = 'highlight-thumb';
      img.src = h.photo;
      img.alt = h.name;
      img.addEventListener('click', () => showPhotoLightbox(h.photo, h.name, () => setHighlightPhoto(d.id, idx)));
      row.appendChild(img);
    } else if (!photosReady) {
      row.appendChild(el('div', 'highlight-thumb-loading'));
    } else {
      const thumbBtn = el('button', 'highlight-thumb-btn', 'Foto');
      thumbBtn.setAttribute('aria-label', 'Agregar foto');
      thumbBtn.addEventListener('click', () => setHighlightPhoto(d.id, idx));
      row.appendChild(thumbBtn);
    }
    row.appendChild(el('div', 'highlight-name', h.name));
    row.appendChild(buildReactions(d, h));
    if (reactionFor('luis', d.id, h.name) === 'love' && reactionFor('eleny', d.id, h.name) === 'love') row.classList.add('both-love');
    const del = el('button', 'highlight-del', '×');
    del.addEventListener('click', () => removeHighlight(d.id, idx));
    row.appendChild(del);
    highlightsBox.appendChild(row);
  });
  section.appendChild(highlightsBox);

  if (openAddHighlight) {
    const form = el('div', 'add-form');
    const input = document.createElement('input');
    input.placeholder = 'ej. Paseo en bote al atardecer';
    const addBtn = el('button', null, 'Agregar');
    addBtn.addEventListener('click', () => addHighlight(d.id, input.value));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addHighlight(d.id, input.value); });
    form.appendChild(input);
    form.appendChild(addBtn);
    section.appendChild(form);
  } else {
    const addRow = el('div', 'add-row', '+ agregar destacado');
    addRow.addEventListener('click', () => { openAddHighlight = true; render(); });
    section.appendChild(addRow);
  }

  card.appendChild(section);

  const lodgingSection = el('div', 'detail-section');
  lodgingSection.appendChild(el('div', 'detail-label', 'HOSPEDAJE'));

  const lodgingList = d.lodging || [];
  if (lodgingList.length === 0 && !openAddLodging) {
    lodgingSection.appendChild(el('div', 'highlight-empty', 'Todavía no hay hospedaje agregado.'));
  }

  const lodgingBox = el('div', 'highlights');
  lodgingList.forEach((l, idx) => {
    const row = el('div', 'highlight-row');
    row.style.animationDelay = (idx * 0.05) + 's';
    if (l.photo) {
      const img = document.createElement('img');
      img.className = 'highlight-thumb';
      img.src = l.photo;
      img.alt = l.name;
      img.addEventListener('click', () => showPhotoLightbox(l.photo, l.name, () => setLodgingPhoto(d.id, idx)));
      row.appendChild(img);
    } else if (!photosReady) {
      row.appendChild(el('div', 'highlight-thumb-loading'));
    } else {
      const thumbBtn = el('button', 'highlight-thumb-btn', 'Foto');
      thumbBtn.setAttribute('aria-label', 'Agregar foto');
      thumbBtn.addEventListener('click', () => setLodgingPhoto(d.id, idx));
      row.appendChild(thumbBtn);
    }
    if (l.url) {
      const link = document.createElement('a');
      link.className = 'highlight-name lodging-link';
      link.href = l.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = l.name;
      row.appendChild(link);
    } else {
      row.appendChild(el('div', 'highlight-name', l.name));
    }
    const del = el('button', 'highlight-del', '×');
    del.addEventListener('click', () => removeLodging(d.id, idx));
    row.appendChild(del);
    lodgingBox.appendChild(row);
  });
  lodgingSection.appendChild(lodgingBox);

  if (openAddLodging) {
    const form = el('div', 'add-form add-form-stack');
    const nameInput = document.createElement('input');
    nameInput.placeholder = 'ej. Rosewood San Miguel';
    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.placeholder = 'Link (Airbnb, sitio del hotel…) — opcional';
    const addBtn = el('button', null, 'Agregar');
    const submitLodging = () => addLodging(d.id, nameInput.value, urlInput.value);
    addBtn.addEventListener('click', submitLodging);
    nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitLodging(); });
    urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') submitLodging(); });
    form.appendChild(nameInput);
    form.appendChild(urlInput);
    form.appendChild(addBtn);
    lodgingSection.appendChild(form);
  } else {
    const addLodgingRow = el('div', 'add-row', '+ agregar hospedaje');
    addLodgingRow.addEventListener('click', () => { openAddLodging = true; render(); });
    lodgingSection.appendChild(addLodgingRow);
  }

  card.appendChild(lodgingSection);

  const favBtn = el('button', 'fav-btn' + (d.favorite ? ' is-fav' : ''));
  favBtn.innerHTML = d.favorite
    ? '<span class="heart">♥</span> En la lista corta'
    : '♡ Agregar a la lista corta';
  favBtn.addEventListener('click', () => toggleFavorite(d.id));
  card.appendChild(favBtn);

  if (d.favorite) {
    card.appendChild(el('div', 'fav-note', 'Anotado — esta hizo el corte.'));
  }

  if (isAdmin && d.custom) {
    const moveBtn = el('button', 'move-pin-btn', 'Mover pin');
    moveBtn.addEventListener('click', () => startMovingPin(d.id));
    card.appendChild(moveBtn);
  }

  const deleteBtn = el('button', 'delete-city-btn', 'Borrar esta ciudad');
  deleteBtn.addEventListener('click', () => deleteDestination(d.id));
  card.appendChild(deleteBtn);

  return card;
}




// Entrance animations only play when the screen changes; a redraw of the same
// screen (after a tap, a sync, data arriving) swaps content in place.
let lastScreenKey = null;
function render() {
  const root = document.getElementById('root');
  root.innerHTML = '';
  const screenKey = view + '|' + (view === 'detail' ? detailId : '') + '|' + (profile || '');
  const sameScreen = screenKey === lastScreenKey;
  lastScreenKey = screenKey;

  if (view === 'splash') {
    const splash = el('div', 'splash-screen');
    const img = document.createElement('img');
    img.className = 'splash-img';
    img.src = SPLASH_IMG;
    img.alt = '¿De aquí a dónde?';
    splash.appendChild(img);
    root.appendChild(splash);
    return;
  }

  const app = el('div', 'app' + (sameScreen ? ' is-redraw' : ''));
  const phase = skyPhase();
  app.classList.add('photo-bg', 'sky-' + phase);
  app.style.backgroundImage = 'url(' + BG_PHOTO_IMG + ')';
  app.appendChild(el('div', 'bg-overlay'));
  app.appendChild(buildSky(phase));
  const wrap = el('div', 'wrap');
  let content;
  if (view === 'intro') content = renderIntro();
  else if (view === 'detail') content = renderDetail();
  else if (view === 'profile') content = renderProfile();
  else if (view === 'swipe') content = renderSwipe();
  else content = renderMap();
  wrap.appendChild(content);
  app.appendChild(wrap);

  if (view !== 'intro' && view !== 'profile') {
    const profileFab = el('button', 'profile-fab');
    profileFab.appendChild(avatarThumbNode(profile, 'fab-thumb'));
    profileFab.setAttribute('aria-label', 'Perfil');
    profileFab.addEventListener('click', goProfile);
    app.appendChild(profileFab);
  }

  root.appendChild(app);
}

render();
// Leaves the splash screen as soon as the first batch of data is ready,
// with a short floor so it never flashes by instantly, and a safety cap
// so a slow connection doesn't leave it stuck for long.
const splashStart = Date.now();
const SPLASH_MIN_MS = 900;
let splashAdvanced = false;
function leaveSplash() {
  if (splashAdvanced || view !== 'splash') return;
  splashAdvanced = true;
  view = 'intro';
  render();
}
setTimeout(leaveSplash, 4000);
Promise.all([
  loadPriorities().then(loadCustomDestinations),
  loadHighlightsData(),
  loadLodgingData(),
  loadCostsData(),
  loadSwipes(),
  loadReactions(),
  loadItineraries(),
  loadActivity(),
  fetchAllPhotosMap(),
])
  .then(([, , , , , , , , photosMap]) => {
    backfillIconicHighlights();
    applyPhotosMap(photosMap);
    setTimeout(leaveSplash, Math.max(0, SPLASH_MIN_MS - (Date.now() - splashStart)));
    if (view !== 'splash') render();
    loadWeather();
  });
registerServiceWorker();
setupPullToRefresh();

`;

export default function Page() {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return; // avoid double-run under React 18 strict mode in dev
    ranRef.current = true;
    const script = document.createElement('script');
    script.textContent = APP_SCRIPT;
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: APP_STYLE }} />
      <div id="root">
        {/* Server-rendered so it paints immediately, before the client
            script loads — the script's own render() replaces this with
            the identical markup once it takes over, so there's no flash. */}
        <div className="splash-screen">
          <img className="splash-img" src="/images/splash.jpg" alt="" />
        </div>
      </div>
    </>
  );
}
