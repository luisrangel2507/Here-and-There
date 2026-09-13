'use client';
import { useEffect, useRef } from 'react';
import Sortable from 'sortablejs';

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
  }
  *{box-sizing:border-box;}
  html, body{margin:0; background:#241a30;}
  .app{
    position:relative;
    overflow-x:hidden;
    min-height:100%;
    padding:36px 16px 80px;
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
  .bg-photo{
    position:absolute;
    inset:0;
    width:100%;
    height:100%;
    object-fit:cover;
    z-index:0;
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
    animation:popIn .3s ease both;
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
    0%{transform:scale(0.6); opacity:0;}
    60%{transform:scale(1.15); opacity:1;}
    100%{transform:scale(1);}
  }

  .view{animation:fadeSlideUp .45s ease both;}

  /* header */
  .eyebrow{
    font-size:11px;
    font-weight:600;
    letter-spacing:0.16em;
    color:#fff;
    text-shadow:0 1px 8px rgba(0,0,0,0.15);
    margin-bottom:12px;
    animation:fadeSlideUp .5s ease both;
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
    animation:fadeSlideUp .55s ease both;
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
    animation:fadeSlideUp .6s ease both;
    animation-delay:.1s;
  }

  .priority-status{
    text-align:center;
    font-size:12px;
    font-weight:600;
    color:rgba(255,255,255,0.85);
    margin-bottom:18px;
  }

  /* region tabs */
  .region-tabs{
    display:flex;
    gap:10px;
    margin-bottom:20px;
    animation:fadeSlideUp .6s ease both;
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
    background:rgba(255,255,255,0.14);
    backdrop-filter:blur(10px);
    border:1.5px solid rgba(255,255,255,0.35);
    border-radius:26px;
    padding:18px;
    margin-bottom:18px;
    animation:fadeSlideUp .65s ease both;
    animation-delay:.16s;
  }
  .map-stage{
    position:relative;
    width:100%;
    border-radius:18px;
    overflow:hidden;
    background:radial-gradient(circle at 30% 20%, rgba(255,255,255,0.14), transparent 60%);
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
  }
  .pin-ring{
    position:absolute;
    inset:-3px;
    border-radius:50%;
    background:var(--plan-color, var(--coral));
    opacity:0.25;
  }
  .pin-dot{
    position:relative;
    width:15px;height:15px;
    border-radius:50%;
    background:var(--plan-color, var(--coral));
    border:2px solid #fff;
    box-shadow:0 3px 8px rgba(0,0,0,0.3);
  }
  .pin-star{
    position:absolute;
    top:-7px;
    right:-8px;
    font-size:11px;
    filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4));
  }
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
  .app-logo{
    display:block;
    width:170px;
    height:170px;
    border-radius:34px;
    margin:0 auto 14px;
    box-shadow:0 16px 36px rgba(75,56,105,0.45);
    animation:popIn .5s ease both;
  }
  .intro-hero{
    width:100%;
    height:230px;
    object-fit:cover;
    border-radius:24px;
    display:block;
    margin-bottom:22px;
    box-shadow:0 20px 45px rgba(75,56,105,0.4);
    animation:fadeSlideUp .55s ease both;
  }
  .profile-select{
    display:flex;
    gap:12px;
    margin-top:22px;
    animation:fadeSlideUp .7s ease both;
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
  .profile-emoji{font-size:30px;margin-bottom:8px;}
  .profile-name{font-family:'Fraunces', serif;font-style:italic;font-weight:700;font-size:18px;}
  .profile-hint{font-size:10.5px;color:rgba(255,255,255,0.7);margin-top:4px;}

  .elim-banner{
    background:rgba(255,255,255,0.18);
    backdrop-filter:blur(8px);
    border:1.5px solid rgba(255,255,255,0.4);
    border-radius:14px;
    padding:12px 16px;
    font-size:12.5px;
    font-weight:500;
    color:#fff;
    text-align:center;
    margin-bottom:16px;
    animation:popIn .4s ease both;
  }
  .priority-list{
    display:flex;
    flex-direction:column;
    gap:9px;
    margin-bottom:8px;
  }
  .priority-row{
    display:flex;
    align-items:center;
    gap:10px;
    background:rgba(255,255,255,0.16);
    backdrop-filter:blur(8px);
    border:1.5px solid rgba(255,255,255,0.35);
    border-left:4px solid var(--plan-color, rgba(255,255,255,0.35));
    border-radius:14px;
    padding:9px 14px;
    user-select:none;
    touch-action:none;
    position:relative;
  }
  .priority-row.dragging{
    opacity:0.85;
    box-shadow:0 14px 30px rgba(0,0,0,0.35);
    background:rgba(255,255,255,0.28);
    z-index:5;
  }
  .priority-row-ghost{
    opacity:0.35;
  }
  .priority-rank{
    flex:0 0 auto;
    width:22px;height:22px;
    border-radius:50%;
    background:rgba(255,255,255,0.25);
    color:#fff;
    font-size:11px;
    font-weight:700;
    display:flex;align-items:center;justify-content:center;
    touch-action:none;
  }
  .priority-mid{ flex:1; min-width:0; touch-action:none; }
  .priority-name{flex:1;min-width:0;font-size:13px;font-weight:600;color:#fff;touch-action:none;}
  .priority-grip{flex:0 0 auto;font-size:15px;color:rgba(255,255,255,0.5);cursor:grab;padding:2px 4px;touch-action:none;}
  .priority-hint{
    font-size:11.5px;
    color:rgba(255,255,255,0.65);
    text-align:center;
    margin-top:12px;
  }
  .change-pick-btn{
    display:block;
    margin:0 auto 18px;
    background:rgba(255,255,255,0.14);
    backdrop-filter:blur(6px);
    border:1.5px solid rgba(255,255,255,0.35);
    color:#fff;
    font-family:'Poppins', sans-serif;
    font-weight:600;
    font-size:12px;
    padding:9px 16px;
    border-radius:999px;
    cursor:pointer;
  }
  .change-pick-btn:hover{ background:rgba(255,255,255,0.22); }
  .winner-card{
    text-align:center;
    padding:36px 20px;
    background:rgba(255,255,255,0.16);
    backdrop-filter:blur(10px);
    border:1.5px solid rgba(255,255,255,0.4);
    border-radius:24px;
    animation:popIn .5s ease both;
  }
  .winner-trophy{font-size:40px;margin-bottom:10px;}
  .winner-city{
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:26px;
    color:#fff;
  }
  .winner-sub{font-size:12.5px;color:rgba(255,255,255,0.75);margin-top:8px;}

  .app-title{
    text-align:center;
    font-family:'Fraunces', serif;
    font-style:italic;
    font-weight:700;
    font-size:24px;
    color:#fff;
    text-shadow:0 1px 8px rgba(0,0,0,0.2);
    margin-bottom:18px;
    letter-spacing:0.02em;
  }
  .app-title-amp{
    font-family:'Poppins', sans-serif;
    font-style:normal;
    font-weight:600;
  }
  .switch-profile{
    display:block;
    margin:22px auto 0;
    background:none;
    border:none;
    color:rgba(255,255,255,0.5);
    font-family:'Poppins', sans-serif;
    font-size:10.5px;
    cursor:pointer;
    padding:6px 10px;
  }
  .switch-profile:hover{color:rgba(255,255,255,0.85);}

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
    animation:fadeSlideUp .7s ease both;
    animation-delay:.2s;
  }
  .dest-row{
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    gap:6px;
    background:rgba(255,255,255,0.14);
    backdrop-filter:blur(8px);
    border:1.5px solid rgba(255,255,255,0.3);
    border-left:4px solid var(--plan-color, rgba(255,255,255,0.3));
    border-radius:16px;
    padding:12px 14px;
    cursor:pointer;
    transition:transform .15s ease, background .15s ease;
  }
  .dest-row:hover{transform:translateY(-1px);background:rgba(255,255,255,0.2);}
  .dest-row-name{font-size:12.5px;font-weight:600;color:#fff;line-height:1.25;}
  .dest-row-plan{font-size:9.5px;font-weight:600;color:rgba(255,255,255,0.75);margin-top:1px;}
  .dest-row-note{font-size:9.5px;color:rgba(255,255,255,0.7);margin-top:1px;}
  .dest-row-right{display:flex;align-items:center;gap:6px;width:100%;justify-content:space-between;}
  .dest-row-price{font-family:'Fraunces', serif;font-style:italic;font-weight:700;font-size:13.5px;color:var(--sun);}
  .dest-row-heart{font-size:13px;}

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
    animation:fadeSlideRight .4s ease both;
  }
  .back-btn:hover{transform:translateX(-3px);}

  .detail-card{
    background:var(--card);
    color:var(--ink);
    border-radius:24px;
    overflow:hidden;
    box-shadow:0 24px 55px rgba(75,56,105,0.4);
    animation:fadeSlideUp .5s ease both;
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
    animation:fadeSlideUp .35s ease both;
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
  .add-form input{
    flex:1;
    min-width:0;
    font-family:'Poppins', sans-serif;
    font-size:12px;
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
  .fav-btn:hover{transform:translateY(-1px);}
  .fav-btn.is-fav{
    background:linear-gradient(90deg, var(--turquoise), var(--turquoise-dim));
    color:#fff;
    box-shadow:0 10px 26px rgba(14,165,160,0.4);
  }
  .fav-btn .heart{display:inline-block;animation:popIn .35s ease;}
  .fav-note{
    margin:0 24px 24px;
    font-family:'Fraunces', serif;
    font-style:italic;
    font-size:13.5px;
    color:rgba(43,27,51,0.7);
    text-align:center;
  }

  @media (max-width:480px){
    .detail-city{font-size:23px;}
    .detail-code{font-size:20px;}
  }

`;

const APP_SCRIPT = `

const MEXICO_MAP_IMG = '/images/mexico-map.jpg';
const LOGO_IMG = '/images/logo.png';
const INTRO_HERO_IMG = '/images/intro-hero.jpg';
const USA_MAP_IMG = '/images/usa-map.jpg';
const BG_PHOTO_IMG = '/images/bg-photo.jpg';
const PLAN_META = {
  beach:     { label: 'Beach',     emoji: '🏖️', color: '#0EA5A0', dim: '#0a7d79' },
  city:      { label: 'City',      emoji: '🏙️', color: '#FF6B5B', dim: '#e14f40' },
  colonial:  { label: 'Colonial',  emoji: '🎭', color: '#8A5FBF', dim: '#6c479c' },
  nature:    { label: 'Nature',    emoji: '🏔️', color: '#3F8F5C', dim: '#2f6c45' },
  nightlife: { label: 'Nightlife', emoji: '🎉', color: '#E0457B', dim: '#b83362' },
};
function planOf(d) { return PLAN_META[d.plan] || PLAN_META.city; }
function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0,2), 16);
  const g = parseInt(h.substring(2,4), 16);
  const b = parseInt(h.substring(4,6), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}

const REGIONS = {
  mexico: {
    label: '🇲🇽 Mexico',
    type: 'image',
    src: MEXICO_MAP_IMG,
    aspect: '900 / 686',
    destinations: [
      {
        id: 'cdmx', city: 'Ciudad de México', country: 'Mexico', code: 'CDMX', plan: 'city',
        vibe: 'Huge, chaotic, and endlessly good — ancient pyramids on the edge of town, world-class museums and cantinas downtown, and rooftop mezcal in Roma/Condesa at night. High altitude, big energy, a taco stand on every corner.',
        price: 7807, note: null,
        highlights: [{ name: 'Pirámides', photo: null }, { name: 'Trajineras', photo: null }, { name: 'Chapultepec', photo: null }, { name: 'Bellas Artes', photo: null }, { name: 'Polanco', photo: null }, { name: 'La Mexicana', photo: null }, { name: 'Bar hopping Roma', photo: null }],
        photo: null, favorite: false, pin: { x: 58.0, y: 64.1 },
      },
      {
        id: 'cabo', city: 'Los Cabos', country: 'Mexico', code: 'SJD', plan: 'beach',
        vibe: 'Desert cliffs dropping straight into turquoise water, the Arch, and a resort strip built for doing nothing productive on purpose. Loud beach clubs by day, quiet marina dinners by night — polished and a little touristy, in a good way.',
        price: 7920, note: null,
        highlights: [{ name: 'Mango Deck', photo: null }, { name: 'Bar hopping', photo: null }, { name: 'All-inclusive Rosewood · $5k/night', photo: null }],
        photo: null, favorite: false, pin: { x: 24.7, y: 48.3 },
      },
      {
        id: 'gdl', city: 'Guadalajara', country: 'Mexico', code: 'GDL', plan: 'city',
        vibe: 'The birthplace of mariachi and tequila, with a walkable colonial centro, leafy plazas, and Tlaquepaque\\'s craft markets just outside town. Calmer and cheaper than CDMX, with a food scene that punches well above its size.',
        price: 8000, note: null,
        highlights: [],
        photo: null, favorite: false, pin: { x: 44.6, y: 58.5 },
      },
      {
        id: 'pvr', city: 'Puerto Vallarta', country: 'Mexico', code: 'PVR', plan: 'beach',
        vibe: 'Cobblestone streets and a jungle-covered mountainside meet the Pacific along a long malecón made for sunset walks. Romantic, a little bohemian, and famously LGBTQ+-friendly — fish tacos on the beach, then rooftop drinks watching the sky turn orange.',
        price: 9739, note: null,
        highlights: [],
        photo: null, favorite: false, pin: { x: 38.9, y: 59.2 },
      },
      {
        id: 'bajio', city: 'Guanajuato', country: 'Mexico', code: 'BJX', plan: 'colonial',
        vibe: 'A hillside maze of candy-colored houses, underground tunnel roads, and callejones too narrow for cars — plus San Miguel de Allende\\'s cathedral-postcard streets a short drive away. Storybook colonial Mexico, best explored on foot and slightly lost.',
        price: 7807, note: 'San Miguel de Allende / Guanajuato Capital',
        highlights: [{ name: 'Ciudad de México', photo: null }, { name: 'Guanajuato capital', photo: null }, { name: 'San Miguel de Allende', photo: null }],
        photo: null, favorite: false, pin: { x: 51.2, y: 57.3 },
      },
    ],
  },
  usa: {
    label: '🇺🇸 USA',
    type: 'image',
    src: USA_MAP_IMG,
    aspect: '1400 / 1052',
    destinations: [
      {
        id: 'tahoe', city: 'Lake Tahoe', country: 'USA', code: 'RNO', plan: 'nature',
        vibe: 'A ridiculously blue alpine lake ringed by pine forest and mountains — hike or paddleboard in summer, ski slopes minutes from the shore in winter. Crisp air, cozy cabins, and views that make you stop mid-sentence.',
        price: 7920, note: 'via SF Airport',
        highlights: [],
        photo: null, favorite: false, pin: { x: 16.65, y: 32.9 },
      },
      {
        id: 'vegas', city: 'Las Vegas', country: 'USA', code: 'LAS', plan: 'nightlife',
        vibe: 'Neon Strip, all-night casinos, pool parties, and a headline show for every mood. Nobody sleeps, everything\\'s open at 3am, and the whole trip can be as extra (or as chill by the pool) as you want it to be.',
        costs: { edu: 4000, eleny: 3000 }, note: null,
        highlights: [],
        photo: null, favorite: false, pin: { x: 23.4, y: 46.25 },
      },
      {
        id: 'austin', city: 'Austin / San Antonio', country: 'USA', code: 'AUS', plan: 'city',
        vibe: 'Two very different Texas cities an hour apart: Austin\\'s live music, food trucks, and lake days versus San Antonio\\'s Alamo, River Walk, and old-Texas history. Easy to combine into one relaxed road-trip-style visit.',
        costs: { edu: 3000, eleny: 4500 }, note: null,
        cities: ['Austin', 'San Antonio'],
        highlights: [],
        photo: null, favorite: false, pin: { x: 49.8, y: 66.3 },
      },
      {
        id: 'miami', city: 'Miami', country: 'USA', code: 'MIA', plan: 'beach',
        vibe: 'Art Deco pastels on South Beach, Cuban coffee on every block, and a nightlife scene that starts late and doesn\\'t apologize for it. Hot, glamorous, and unmistakably Latin — beach by day, salsa by night.',
        costs: { edu: 7261, eleny: 6000 }, note: null,
        highlights: [],
        photo: null, favorite: false, pin: { x: 81.1, y: 73.4 },
      },
      {
        id: 'sandiego', city: 'San Diego', country: 'USA', code: 'SAN', plan: 'beach',
        vibe: 'Laid-back surf town energy, near-perfect weather year-round, and a craft beer scene to match. Balboa Park, easy beach days, and a short hop to Mexico if you want tacos on the other side of the border.',
        price: 6500, note: null,
        highlights: [],
        photo: null, favorite: false, pin: { x: 19.15, y: 54.6 },
      },
    ],
  },
};

const money = n => '$' + n.toLocaleString('en-US');

function getDest(id) {
  for (const key of Object.keys(REGIONS)) {
    const found = REGIONS[key].destinations.find(d => d.id === id);
    if (found) return found;
  }
  return null;
}
function destTotal(d) {
  return d.price != null ? d.price : (d.costs.edu + d.costs.eleny);
}

const ADMIN_CODE = 'aguacate9';
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'priorities-state';

function allDestinations() {
  return [...REGIONS.mexico.destinations, ...REGIONS.usa.destinations];
}
function defaultOrder() {
  return allDestinations().map(d => d.id);
}

let priorityOrder = defaultOrder();
let blockedIds = [];
let lastSubmitAt = null;
let justEliminatedId = null;

function cooldownRemaining() {
  if (!lastSubmitAt) return 0;
  const remaining = (lastSubmitAt + COOLDOWN_MS) - Date.now();
  return remaining > 0 ? remaining : 0;
}
function formatCountdown(ms) {
  const totalMin = Math.max(1, Math.ceil(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return (h > 0 ? h + 'h ' : '') + m + 'm';
}

async function savePriorities() {
  try {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priorityOrder, blockedIds, lastSubmitAt }),
    });
  } catch (e) { /* best-effort only */ }
}
async function loadPriorities() {
  try {
    const res = await fetch('/api/state');
    if (res.ok) {
      const parsed = await res.json();
      if (parsed) {
        blockedIds = parsed.blockedIds || [];
        priorityOrder = (parsed.priorityOrder || defaultOrder()).filter(id => !blockedIds.includes(id));
        lastSubmitAt = parsed.lastSubmitAt || null;
        render();
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
      if (!d) return;
      d.highlights = map[destId].map(h => ({ name: h.name, city: h.city || null, photo: null }));
    });
    render();
  } catch (e) { /* keep defaults */ }
}

// ---- photos (uploaded from the device, persisted as compressed data URLs) ----
function photoKeyForHighlight(id, name) {
  return 'dest:' + id + ':highlight:' + name;
}

async function savePhoto(key, dataUrl) {
  try {
    await fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, dataUrl }),
    });
  } catch (e) { /* best-effort only */ }
}

async function loadPhotos() {
  try {
    const res = await fetch('/api/photos');
    if (!res.ok) return;
    const map = await res.json();
    allDestinations().forEach(d => {
      d.highlights.forEach(h => {
        const hKey = photoKeyForHighlight(d.id, h.name);
        if (map[hKey]) h.photo = map[hKey];
      });
    });
    render();
  } catch (e) { /* keep defaults */ }
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
      window.alert('Could not load that photo.');
    }
  });
  input.click();
}

function showPhotoLightbox(src, alt, onReplace) {
  const backdrop = el('div', 'lightbox-backdrop');

  const closeBtn = el('button', 'lightbox-close', '×');
  closeBtn.setAttribute('aria-label', 'Close');
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
  downloadLink.textContent = '⬇ Download';
  actions.appendChild(downloadLink);

  if (onReplace) {
    const replaceBtn = el('button', 'lightbox-btn', '🔄 Replace');
    replaceBtn.addEventListener('click', () => { close(); onReplace(); });
    actions.appendChild(replaceBtn);
  }
  backdrop.appendChild(actions);

  function close() { backdrop.remove(); }
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

  document.body.appendChild(backdrop);
}

function submitPriorities() {
  if (cooldownRemaining() > 0 || priorityOrder.length <= 1) return;
  const eliminatedId = priorityOrder[priorityOrder.length - 1];
  blockedIds.push(eliminatedId);
  priorityOrder = priorityOrder.filter(id => id !== eliminatedId);
  lastSubmitAt = Date.now();
  justEliminatedId = eliminatedId;
  savePriorities();
  render();
}

function goPriorities() {
  view = 'priorities';
  justEliminatedId = null;
  render();
}

function changeTodaysPick() {
  if (blockedIds.length === 0) return;
  const restoredId = blockedIds.pop();
  priorityOrder.push(restoredId);
  lastSubmitAt = null;
  justEliminatedId = null;
  savePriorities();
  render();
}

// ---- state ----
let view = 'intro'; // 'intro' | 'map' | 'detail'
let region = 'mexico'; // 'mexico' | 'usa'
let detailId = null;
let openAddHighlight = false;
let selectedHighlightCity = null;
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
    card.appendChild(el('div', 'passcode-icon', '🔒'));
    card.appendChild(el('div', 'passcode-title', 'Enter Passcode'));
    card.appendChild(el('div', 'passcode-sub', 'This unlocks Luis\\'s view.'));

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
    const cancelBtn = el('button', 'passcode-btn passcode-cancel', 'Cancel');
    const okBtn = el('button', 'passcode-btn passcode-ok', 'Unlock');
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
      error.textContent = 'Incorrect passcode';
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

function goDetail(id) {
  const d = getDest(id);
  region = d.country === 'Mexico' ? 'mexico' : 'usa';
  detailId = id;
  view = 'detail';
  openAddHighlight = false;
  selectedHighlightCity = d.cities ? d.cities[0] : null;
  render();
}
function goMap() {
  view = 'map';
  detailId = null;
  render();
}
function toggleFavorite(id) {
  const d = getDest(id);
  d.favorite = !d.favorite;
  render();
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
    h.photo = dataUrl;
    render();
    savePhoto(photoKeyForHighlight(id, h.name), dataUrl);
  });
}

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}
function appTitle() {
  return el('div', 'app-title', '🌵 Here <span class="app-title-amp">&</span> There 🌁');
}

function renderIntro() {
  const view_ = el('div', 'view');

  const logo = document.createElement('img');
  logo.className = 'app-logo';
  logo.src = LOGO_IMG;
  logo.alt = 'Here & There';
  view_.appendChild(logo);

  const hero = document.createElement('img');
  hero.className = 'intro-hero';
  hero.src = INTRO_HERO_IMG;
  hero.alt = 'Eleny and Luis';
  view_.appendChild(hero);

  const header = el('div');
  header.style.textAlign = 'center';
  header.appendChild(el('h1', null, 'Where should we <em>run away</em> to?'));
  view_.appendChild(header);

  const chooseLabel = el('div', 'sub', 'Choose the traveler');
  chooseLabel.style.textAlign = 'center';
  chooseLabel.style.marginTop = '4px';
  view_.appendChild(chooseLabel);

  const select = el('div', 'profile-select');

  const luisCard = el('div', 'profile-card');
  luisCard.innerHTML = '<div class="profile-emoji">🇲🇽</div><div class="profile-name">Luis</div><div class="profile-hint">passcode required</div>';
  luisCard.addEventListener('click', () => selectProfile('luis'));
  select.appendChild(luisCard);

  const elenyCard = el('div', 'profile-card');
  elenyCard.innerHTML = '<div class="profile-emoji">🇺🇸</div><div class="profile-name">Eleny</div><div class="profile-hint">tap to enter</div>';
  elenyCard.addEventListener('click', () => selectProfile('eleny'));
  select.appendChild(elenyCard);

  view_.appendChild(select);

  return view_;
}

function renderMap() {
  const view_ = el('div', 'view');
  view_.appendChild(appTitle());

  const priBtn = el('button', 'confirm-btn', '🗳️ Daily priority pick');
  priBtn.style.marginBottom = '6px';
  priBtn.addEventListener('click', goPriorities);
  view_.appendChild(priBtn);

  const priRemaining = cooldownRemaining();
  view_.appendChild(el('div', 'priority-status', priRemaining > 0
    ? '🔒 Next pick in ' + formatCountdown(priRemaining)
    : '✅ Ready to rank today'));

  const tabs = el('div', 'region-tabs');
  Object.keys(REGIONS).forEach(key => {
    const btn = el('button', 'region-tab' + (region === key ? ' active' : ''), REGIONS[key].label);
    btn.addEventListener('click', () => { region = key; render(); });
    tabs.appendChild(btn);
  });
  view_.appendChild(tabs);

  const r = { ...REGIONS[region], destinations: REGIONS[region].destinations.filter(d => !blockedIds.includes(d.id)) };

  const mapCard = el('div', 'map-card');
  const stage = el('div', 'map-stage');
  stage.style.aspectRatio = r.aspect;

  if (r.type === 'image') {
    const img = document.createElement('img');
    img.className = 'map-img';
    img.src = r.src;
    img.alt = r.label + ' map';
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

  r.destinations.forEach(d => {
    const plan = planOf(d);
    const pin = el('button', 'pin');
    pin.style.left = d.pin.x + '%';
    pin.style.top = d.pin.y + '%';
    pin.style.setProperty('--plan-color', plan.color);
    const dotWrap = el('div', 'pin-dot-wrap');
    dotWrap.appendChild(el('div', 'pin-ring'));
    dotWrap.appendChild(el('div', 'pin-dot'));
    if (d.favorite) dotWrap.appendChild(el('div', 'pin-star', '⭐'));
    pin.appendChild(dotWrap);
    pin.addEventListener('click', () => goDetail(d.id));
    stage.appendChild(pin);
  });

  mapCard.appendChild(stage);
  mapCard.appendChild(el('div', 'map-hint', 'Tap any pin to open the full proposal'));

  const plansUsed = [...new Set(r.destinations.map(d => d.plan))];
  const legend = el('div', 'legend');
  plansUsed.forEach(planKey => {
    const meta = PLAN_META[planKey];
    const item = el('div', 'legend-item');
    item.style.setProperty('--plan-color', meta.color);
    item.appendChild(el('div', 'legend-swatch'));
    item.appendChild(document.createTextNode(meta.emoji + ' ' + meta.label));
    legend.appendChild(item);
  });
  mapCard.appendChild(legend);
  view_.appendChild(mapCard);

  const list = el('div', 'dest-list');
  r.destinations.forEach(d => {
    const plan = planOf(d);
    const row = el('div', 'dest-row');
    row.style.setProperty('--plan-color', plan.color);
    const left = el('div');
    left.appendChild(el('div', 'dest-row-name', d.city));
    left.appendChild(el('div', 'dest-row-plan', plan.emoji + ' ' + plan.label));
    if (d.note) left.appendChild(el('div', 'dest-row-note', d.note));
    row.appendChild(left);
    const right = el('div', 'dest-row-right');
    if (d.favorite) right.appendChild(el('span', 'dest-row-heart', '💛'));
    if (isAdmin) right.appendChild(el('div', 'dest-row-price', money(destTotal(d))));
    row.appendChild(right);
    row.addEventListener('click', () => goDetail(d.id));
    list.appendChild(row);
  });
  view_.appendChild(list);

  const switchBtn = el('button', 'switch-profile', '↺ Switch profile (' + (profile === 'luis' ? 'Luis' : 'Eleny') + ')');
  switchBtn.addEventListener('click', goIntro);
  view_.appendChild(switchBtn);

  return view_;
}

function renderDetail() {
  const view_ = el('div', 'view');
  const d = getDest(detailId);
  const plan = planOf(d);
  view_.appendChild(appTitle());

  const backBtn = el('button', 'back-btn', '← Back to map');
  backBtn.addEventListener('click', goMap);
  view_.appendChild(backBtn);

  const card = el('div', 'detail-card');
  card.style.setProperty('--plan-color', plan.color);
  card.style.setProperty('--plan-dim', plan.dim);
  card.style.setProperty('--plan-soft1', hexToRgba(plan.color, 0.32));
  card.style.setProperty('--plan-soft2', hexToRgba(plan.dim, 0.22));

  const photoHighlights = d.highlights.map((h, idx) => ({ h, idx })).filter(x => x.h.photo);
  if (photoHighlights.length > 0) {
    const gallery = el('div', 'gallery');
    gallery.appendChild(el('div', 'gallery-label', 'PHOTOS'));
    const scroller = el('div', 'gallery-scroll');
    photoHighlights.forEach(({ h, idx }) => {
      const img = document.createElement('img');
      img.className = 'gallery-thumb';
      img.src = h.photo;
      img.alt = h.name;
      img.addEventListener('click', () => showPhotoLightbox(h.photo, h.name, () => setHighlightPhoto(d.id, idx)));
      scroller.appendChild(img);
    });
    gallery.appendChild(scroller);
    card.appendChild(gallery);
  }

  const head = el('div', 'detail-head');
  const headLeft = el('div', 'detail-head-left');
  headLeft.appendChild(el('div', 'detail-city', d.city));
  headLeft.appendChild(el('div', 'detail-country', d.country));
  headLeft.appendChild(el('div', 'detail-plan-chip', plan.emoji + ' ' + plan.label));
  if (d.note) headLeft.appendChild(el('div', 'detail-note', d.note));
  head.appendChild(headLeft);
  head.appendChild(el('div', 'detail-code', d.code));
  card.appendChild(head);

  if (d.vibe) card.appendChild(el('p', 'detail-vibe', d.vibe));

  const priceBlock = el('div', 'price-block');
  priceBlock.appendChild(el('div', 'price-total-label', 'ESTIMATED TOTAL'));
  priceBlock.appendChild(el('div', 'price-total', money(destTotal(d))));
  if (d.costs) {
    const split = el('div', 'price-split');
    split.innerHTML = '<span>Edu <b>' + money(d.costs.edu) + '</b></span><span>Eleny <b>' + money(d.costs.eleny) + '</b></span>';
    priceBlock.appendChild(split);
  }
  if (isAdmin) card.appendChild(priceBlock);

  const section = el('div', 'detail-section');
  section.appendChild(el('div', 'detail-label', 'HIGHLIGHTS'));

  if (d.cities) {
    const cityTabs = el('div', 'city-tabs');
    d.cities.forEach(cityName => {
      const tab = el('button', 'city-tab' + (selectedHighlightCity === cityName ? ' active' : ''), cityName);
      tab.addEventListener('click', () => { selectedHighlightCity = cityName; render(); });
      cityTabs.appendChild(tab);
    });
    section.appendChild(cityTabs);
  }

  const visibleHighlights = d.highlights.filter(h => !d.cities || h.city === selectedHighlightCity);
  if (visibleHighlights.length === 0 && !openAddHighlight) {
    section.appendChild(el('div', 'highlight-empty', 'No highlights added yet.'));
  }

  const highlightsBox = el('div', 'highlights');
  d.highlights.forEach((h, idx) => {
    if (d.cities && h.city !== selectedHighlightCity) return;
    const row = el('div', 'highlight-row');
    row.style.animationDelay = (idx * 0.05) + 's';
    if (h.photo) {
      const img = document.createElement('img');
      img.className = 'highlight-thumb';
      img.src = h.photo;
      img.alt = h.name;
      img.addEventListener('click', () => showPhotoLightbox(h.photo, h.name, () => setHighlightPhoto(d.id, idx)));
      row.appendChild(img);
    } else {
      const thumbBtn = el('button', 'highlight-thumb-btn', '📷');
      thumbBtn.setAttribute('aria-label', 'Add photo');
      thumbBtn.addEventListener('click', () => setHighlightPhoto(d.id, idx));
      row.appendChild(thumbBtn);
    }
    row.appendChild(el('div', 'highlight-name', h.name));
    const del = el('button', 'highlight-del', '×');
    del.addEventListener('click', () => removeHighlight(d.id, idx));
    row.appendChild(del);
    highlightsBox.appendChild(row);
  });
  section.appendChild(highlightsBox);

  if (openAddHighlight) {
    const form = el('div', 'add-form');
    const input = document.createElement('input');
    input.placeholder = 'e.g. Sunset boat tour';
    const addBtn = el('button', null, 'Add');
    addBtn.addEventListener('click', () => addHighlight(d.id, input.value));
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addHighlight(d.id, input.value); });
    form.appendChild(input);
    form.appendChild(addBtn);
    section.appendChild(form);
  } else {
    const addRow = el('div', 'add-row', '+ add highlight');
    addRow.addEventListener('click', () => { openAddHighlight = true; render(); });
    section.appendChild(addRow);
  }

  card.appendChild(section);

  const favBtn = el('button', 'fav-btn' + (d.favorite ? ' is-fav' : ''));
  favBtn.innerHTML = d.favorite
    ? '<span class="heart">💛</span> On the shortlist'
    : '🤍 Add to shortlist';
  favBtn.addEventListener('click', () => toggleFavorite(d.id));
  card.appendChild(favBtn);

  if (d.favorite) {
    card.appendChild(el('div', 'fav-note', 'Noted — this one just made the cut.'));
  }

  view_.appendChild(card);

  const switchBtn = el('button', 'switch-profile', '↺ Switch profile (' + (profile === 'luis' ? 'Luis' : 'Eleny') + ')');
  switchBtn.addEventListener('click', goIntro);
  view_.appendChild(switchBtn);

  return view_;
}

let sortableInstance = null;
function initSortable(listEl) {
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }
  sortableInstance = new Sortable(listEl, {
    animation: 150,
    forceFallback: true, // consistent touch handling instead of flaky native HTML5 DnD on iOS
    fallbackClass: 'dragging',
    ghostClass: 'priority-row-ghost',
    onEnd: function () {
      priorityOrder = Array.from(listEl.children).map(c => c.dataset.id);
      render();
    },
  });
}

function renderPriorities() {
  const view_ = el('div', 'view');
  view_.appendChild(appTitle());

  const backBtn = el('button', 'back-btn', '← Back to map');
  backBtn.addEventListener('click', goMap);
  view_.appendChild(backBtn);

  view_.appendChild(el('div', 'eyebrow', '🗳️ DAILY PRIORITY PICK'));
  view_.appendChild(el('h1', null, 'Rank today\\'s <em>favorites</em>'));

  if (justEliminatedId) {
    const gone = getDest(justEliminatedId);
    if (gone) view_.appendChild(el('div', 'elim-banner', '💔 ' + gone.city + ' just got cut — ' + priorityOrder.length + ' left.'));
  }

  if (priorityOrder.length <= 1) {
    const winnerId = priorityOrder[0];
    const winner = winnerId ? getDest(winnerId) : null;
    const card = el('div', 'winner-card');
    card.appendChild(el('div', 'winner-trophy', '🏆'));
    card.appendChild(el('div', 'winner-city', winner ? winner.city : '—'));
    card.appendChild(el('div', 'winner-sub', 'That\\'s it — this is the one.'));
    view_.appendChild(card);
    return view_;
  }

  const remaining = cooldownRemaining();
  view_.appendChild(el('p', 'sub', remaining > 0
    ? 'Ranking locked for today — next pick in ' + formatCountdown(remaining) + '.'
    : 'Drag to rank them — whichever ends up last gets cut for good.'));

  if (remaining > 0 && blockedIds.length > 0) {
    const changeBtn = el('button', 'change-pick-btn', '✏️ Change my pick (restarts the 24h clock)');
    changeBtn.addEventListener('click', changeTodaysPick);
    view_.appendChild(changeBtn);
  }

  const list = el('div', 'priority-list');
  priorityOrder.forEach((id, idx) => {
    const d = getDest(id);
    if (!d) return;
    const plan = planOf(d);
    const row = el('div', 'priority-row' + (remaining > 0 ? ' locked' : ''));
    row.dataset.id = id;
    row.style.setProperty('--plan-color', plan.color);
    row.appendChild(el('div', 'priority-rank', String(idx + 1)));
    const mid = el('div', 'priority-mid');
    mid.appendChild(el('div', 'priority-name', d.city));
    row.appendChild(mid);
    row.appendChild(el('div', 'priority-grip', remaining > 0 ? '🔒' : '⠿'));
    list.appendChild(row);
  });
  view_.appendChild(list);
  if (remaining === 0) initSortable(list);

  if (remaining === 0) {
    const confirmBtn = el('button', 'confirm-btn', 'Lock in today\\'s ranking →');
    confirmBtn.addEventListener('click', submitPriorities);
    view_.appendChild(confirmBtn);
    view_.appendChild(el('div', 'priority-hint', 'Whatever lands last is out — no take-backs.'));
  }

  return view_;
}

function render() {
  const root = document.getElementById('root');
  root.innerHTML = '';
  const app = el('div', 'app');
  app.classList.add('photo-bg');
  const bgImg = document.createElement('img');
  bgImg.className = 'bg-photo';
  bgImg.src = BG_PHOTO_IMG;
  bgImg.alt = '';
  app.appendChild(bgImg);
  app.appendChild(el('div', 'bg-overlay'));
  const wrap = el('div', 'wrap');
  let content;
  if (view === 'intro') content = renderIntro();
  else if (view === 'detail') content = renderDetail();
  else if (view === 'priorities') content = renderPriorities();
  else content = renderMap();
  wrap.appendChild(content);
  app.appendChild(wrap);
  root.appendChild(app);
}

loadPriorities();
loadHighlightsData().then(loadPhotos);
render();

`;

export default function Page() {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return; // avoid double-run under React 18 strict mode in dev
    ranRef.current = true;
    (window as any).Sortable = Sortable;
    const script = document.createElement('script');
    script.textContent = APP_SCRIPT;
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: APP_STYLE }} />
      <div id="root" />
    </>
  );
}
