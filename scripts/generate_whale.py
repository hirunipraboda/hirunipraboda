#!/usr/bin/env python3
"""
Custom Animated Whale GitHub Contribution Graph Generator
Author: Hiruni Praboda Portfolio & Profile
Generates an animated ocean-themed whale SVG from real GitHub contributions.
"""

import os
import re
import urllib.request
import json
import datetime

# Whale silhouette template (46 cols x 18 rows)
# Core cells: rows 0-16 (363 cells)
# Row 17 optional cells used dynamically to match exact calendar count (365-371 days)
WHALE_TEMPLATE = [
    #         1         2         3         4    
    #0123456789012345678901234567890123456789012345
    "                                  ..          ", #  0: spout mist
    "                                 ....         ", #  1: spout plume
    "                                ......        ", #  2: spout plume spread
    "                                  ..          ", #  3: spout base
    "                                ........      ", #  4: head top & blowhole
    "                     ..       ..............  ", #  5: dorsal fin tip & upper head
    " ..                 .....    ................ ", #  6: top fluke & dorsal & back
    "....               .......  ..................", #  7: fluke & back & head
    " ....             ............................", #  8: fluke & torso & snout
    "  ...            .............................", #  9: peduncle & body & snout
    "   ...          ..............................", # 10: peduncle & body & jaw
    "  ...          ...............................", # 11: peduncle & belly & jaw
    " ....         ................................", # 12: fluke & belly & chin
    ".....          .............................. ", # 13: fluke & belly
    " ...            ............................  ", # 14: fluke & belly
    "  ..             ...............  ......      ", # 15: fluke & belly & flipper
    "                  .............    ....       ", # 16: lower belly & flipper
    "                    .........       ..        ", # 17: optional belly & flipper tip
]

def fetch_contributions_graphql(username, token):
    """Fetch contribution calendar via GitHub GraphQL API if token is provided."""
    query = """
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
    """
    req = urllib.request.Request(
        "https://api.github.com/graphql",
        data=json.dumps({"query": query, "variables": {"login": username}}).encode('utf-8'),
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "Whale-Contribution-Generator"
        }
    )
    level_map = {
        "NONE": 0,
        "FIRST_QUARTILE": 1,
        "SECOND_QUARTILE": 2,
        "THIRD_QUARTILE": 3,
        "FOURTH_QUARTILE": 4
    }
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        calendar = data['data']['user']['contributionsCollection']['contributionCalendar']
        days = []
        for week in calendar['weeks']:
            for day in week['contributionDays']:
                days.append({
                    'date': day['date'],
                    'count': day['contributionCount'],
                    'level': level_map.get(day['contributionLevel'], 0)
                })
        return days, calendar['totalContributions']

def fetch_contributions_scrape(username):
    """Fetch contribution calendar via public GitHub profile contributions page."""
    url = f"https://github.com/users/{username}/contributions"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')

    pattern = r'<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-[^"]+)"[^>]*data-level="(\d+)"'
    tds = re.findall(pattern, html)
    if not tds:
        pattern2 = r'<td[^>]*id="(contribution-day-component-[^"]+)"[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="(\d+)"'
        tds = [(d, cid, l) for cid, d, l in re.findall(pattern2, html)]

    tt_matches = re.findall(r'for="(contribution-day-component-[^"]+)"[^>]*>(.*?)</tool-tip>', html, re.DOTALL)
    tt_dict = {cid: txt.strip() for cid, txt in tt_matches}

    days = []
    total_count = 0
    for date, cid, level in tds:
        tt = tt_dict.get(cid, "")
        c_m = re.search(r'(\d+)\s+contribution', tt)
        count = int(c_m.group(1)) if c_m else 0
        total_count += count
        days.append({'date': date, 'level': int(level), 'count': count})

    days.sort(key=lambda d: d['date'])
    return days, total_count

def fetch_contributions(username="hirunipraboda"):
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        try:
            print("Fetching contributions using GitHub GraphQL API...")
            return fetch_contributions_graphql(username, token)
        except Exception as e:
            print(f"GraphQL fetch failed: {e}. Falling back to web scraping...")
    
    print("Fetching contributions via public GitHub profile scraping...")
    return fetch_contributions_scrape(username)

def build_whale_grid(days):
    core = []
    optional = []
    
    for y, row in enumerate(WHALE_TEMPLATE):
        for x, ch in enumerate(row):
            if ch != ' ':
                if y == 17:
                    optional.append((x, y))
                else:
                    core.append((x, y))

    target_count = len(days)
    selected = list(core)
    
    if len(selected) < target_count:
        needed = target_count - len(selected)
        # Order optional row 17: flipper tip first (cols 36-37), then belly center outward
        opt_sorted = sorted(optional, key=lambda pt: 0 if pt[0] >= 35 else abs(pt[0] - 24))
        selected.extend(opt_sorted[:needed])
        
    if len(selected) > target_count:
        selected = selected[:target_count]

    # Sort coordinates chronologically from tail (left) to head (right), top to bottom
    selected.sort(key=lambda pt: (pt[0], pt[1]))
    
    mapped_cells = []
    for idx, (x, y) in enumerate(selected):
        day = days[idx] if idx < len(days) else {'date': '', 'level': 0, 'count': 0}
        mapped_cells.append({
            'x': x,
            'y': y,
            'date': day['date'],
            'level': day['level'],
            'count': day['count']
        })
    return mapped_cells

def generate_whale_svg(username="hirunipraboda", output_paths=None):
    if output_paths is None:
        output_paths = ["github-whale-contributions.svg"]
        
    days, total_count = fetch_contributions(username)
    mapped_cells = build_whale_grid(days)
    
    active_days = sum(1 for d in days if d['count'] > 0 or d['level'] > 0)
    start_date = days[0]['date'] if days else ""
    end_date = days[-1]['date'] if days else ""

    # Oceanic Palette:
    # 0: Midnight Abyssal Navy
    # 1: Deep Ocean Cerulean
    # 2: Vibrant Marine Blue
    # 3: Tropical Turquoise
    # 4: Radiant Electric Cyan
    colors = {
        0: {'fill': '#0E1C31', 'stroke': '#162C4C'},
        1: {'fill': '#0284C7', 'stroke': '#38BDF8'},
        2: {'fill': '#0EA5E9', 'stroke': '#7DD3FC'},
        3: {'fill': '#06B6D4', 'stroke': '#67E8F9'},
        4: {'fill': '#38BDF8', 'stroke': '#FFFFFF'}
    }

    cell_size = 13
    cell_gap = 3.5
    pitch = cell_size + cell_gap
    
    min_x = min(c['x'] for c in mapped_cells)
    max_x = max(c['x'] for c in mapped_cells)
    min_y = min(c['y'] for c in mapped_cells)
    max_y = max(c['y'] for c in mapped_cells)
    
    grid_w = (max_x - min_x + 1) * pitch
    grid_h = (max_y - min_y + 1) * pitch

    svg_width = 860
    svg_height = 450
    offset_x = (svg_width - grid_w) / 2
    offset_y = 92

    cells_svg = []
    for c in mapped_cells:
        px = offset_x + (c['x'] - min_x) * pitch
        py = offset_y + (c['y'] - min_y) * pitch
        lvl = c['level']
        style = colors.get(lvl, colors[0])
        
        extra_class = ""
        if lvl >= 4:
            extra_class = " cell-glow-high"
        elif lvl >= 2:
            extra_class = " cell-glow-med"
        elif c['y'] <= 3 and c['x'] >= 32:
            extra_class = " cell-spout"
            
        stroke_color = style['stroke']
        fill_color = style['fill']
        
        title_txt = f"{c['count']} contribution{'s' if c['count'] != 1 else ''} on {c['date']}" if c['date'] else "No contributions"
        
        cells_svg.append(f"""    <rect class="cell{extra_class}" x="{px:.1f}" y="{py:.1f}" width="{cell_size}" height="{cell_size}" rx="2.5" fill="{fill_color}" stroke="{stroke_color}" stroke-width="0.8">
      <title>{title_txt}</title>
    </rect>""")

    # Eye coordinate (row 9, col 41)
    eye_px = offset_x + (41 - min_x) * pitch + cell_size / 2
    eye_py = offset_y + (9 - min_y) * pitch + cell_size / 2

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {svg_width} {svg_height}" width="{svg_width}" height="{svg_height}">
  <defs>
    <!-- Ocean Deep Gradient -->
    <linearGradient id="oceanBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070E1E"/>
      <stop offset="50%" stop-color="#040914"/>
      <stop offset="100%" stop-color="#02050D"/>
    </linearGradient>

    <!-- Water Surface Shimmer -->
    <linearGradient id="surfaceGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284C7" stop-opacity="0"/>
      <stop offset="50%" stop-color="#38BDF8" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#0284C7" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <style>
    /* Typography */
    .title-text {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 1.5px;
      fill: #F0F6FC;
    }}
    .stat-number {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-weight: 800;
      font-size: 17px;
      fill: #38BDF8;
    }}
    .stat-label {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-weight: 500;
      font-size: 12px;
      fill: #94A3B8;
    }}
    .meta-text {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-weight: 500;
      font-size: 11px;
      fill: #64748B;
    }}
    .legend-text {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      font-size: 11px;
      fill: #94A3B8;
    }}

    /* Whale Floating Swim Animation */
    @keyframes ocean-swim {{
      0% {{
        transform: translateY(0px) rotate(0deg);
      }}
      50% {{
        transform: translateY(-6px) rotate(-0.5deg);
      }}
      100% {{
        transform: translateY(0px) rotate(0deg);
      }}
    }}
    .whale-group {{
      animation: ocean-swim 7.5s ease-in-out infinite;
      transform-origin: {svg_width/2:.1f}px {offset_y + grid_h/2:.1f}px;
    }}

    /* Bioluminescent Glow */
    @keyframes bio-pulse {{
      0%, 100% {{ opacity: 0.92; filter: drop-shadow(0 0 2px #38bdf8); }}
      50% {{ opacity: 1; filter: drop-shadow(0 0 6px #38bdf8); }}
    }}
    .cell-glow-high {{
      animation: bio-pulse 3.5s ease-in-out infinite;
    }}

    /* Water Spout Shimmer */
    @keyframes spout-shimmer {{
      0%, 100% {{ opacity: 0.8; transform: translateY(0); }}
      50% {{ opacity: 1; transform: translateY(-2px); }}
    }}
    .cell-spout {{
      animation: spout-shimmer 2.8s ease-in-out infinite;
    }}

    /* Animated Rising Bubbles */
    @keyframes bubble-rise-1 {{
      0% {{ transform: translateY(0) translateX(0); opacity: 0; }}
      20% {{ opacity: 0.65; }}
      80% {{ opacity: 0.4; }}
      100% {{ transform: translateY(-110px) translateX(-12px); opacity: 0; }}
    }}
    @keyframes bubble-rise-2 {{
      0% {{ transform: translateY(0) translateX(0); opacity: 0; }}
      25% {{ opacity: 0.7; }}
      85% {{ opacity: 0.45; }}
      100% {{ transform: translateY(-135px) translateX(15px); opacity: 0; }}
    }}
    @keyframes bubble-rise-3 {{
      0% {{ transform: translateY(0) translateX(0); opacity: 0; }}
      30% {{ opacity: 0.6; }}
      90% {{ opacity: 0.35; }}
      100% {{ transform: translateY(-95px) translateX(8px); opacity: 0; }}
    }}
    .bubble-1 {{ animation: bubble-rise-1 5.2s ease-in infinite; }}
    .bubble-2 {{ animation: bubble-rise-2 6.8s ease-in infinite 1.8s; }}
    .bubble-3 {{ animation: bubble-rise-3 4.8s ease-in infinite 3.2s; }}
    .bubble-4 {{ animation: bubble-rise-1 6.1s ease-in infinite 0.9s; }}
    .bubble-5 {{ animation: bubble-rise-2 5.5s ease-in infinite 2.5s; }}

    /* Interactive Hover */
    .cell {{
      transition: transform 0.2s ease, opacity 0.2s ease;
      cursor: pointer;
    }}
    .cell:hover {{
      opacity: 1 !important;
      stroke: #FFFFFF !important;
      stroke-width: 1.5px !important;
    }}
  </style>

  <!-- Deep Ocean Container -->
  <rect width="100%" height="100%" rx="18" fill="url(#oceanBg)"/>
  <rect x="0.75" y="0.75" width="{svg_width - 1.5}" height="{svg_height - 1.5}" rx="17.25" fill="none" stroke="#162C4C" stroke-width="1.5"/>

  <!-- Top Ambient Water Light Shimmer -->
  <rect x="2" y="2" width="{svg_width - 4}" height="45" rx="16" fill="url(#surfaceGlow)"/>

  <!-- Header Section -->
  <g id="header">
    <!-- Whale Badge Icon -->
    <g transform="translate(38, 28)">
      <circle cx="16" cy="16" r="16" fill="#0E1C31" stroke="#1E3A5F" stroke-width="1"/>
      <path d="M 9 17 C 9 12 14 10 21 11 C 24 11 26 12 26 14 C 26 18 20 21 15 21 C 12 21 9 19 9 17 Z M 21 11 C 23 8 26 8 26 8 C 26 8 25 11 25 12" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="12" cy="15" r="1" fill="#38BDF8"/>
    </g>

    <!-- Title and Subtitle -->
    <text x="80" y="42" class="title-text">HIRUNI PRABODA · OCEAN CALENDAR</text>
    <text x="80" y="58" class="meta-text">{start_date} → {end_date} · Year of the Blue Whale</text>

    <!-- Stat Badges on Right -->
    <g transform="translate({svg_width - 240}, 28)">
      <rect width="202" height="36" rx="10" fill="#0E1C31" stroke="#1E3A5F" stroke-width="1"/>
      <text x="16" y="24" class="stat-number">{total_count}</text>
      <text x="56" y="22" class="stat-label">Contributions</text>
      <circle cx="140" cy="18" r="2.5" fill="#38BDF8"/>
      <text x="150" y="22" class="stat-label">{active_days}d active</text>
    </g>
  </g>

  <!-- Animated Swimming Whale Group -->
  <g class="whale-group">
    <!-- Whale Cells -->
    <g id="whale-cells">
{chr(10).join(cells_svg)}
    </g>

    <!-- Eye of the Whale -->
    <g id="whale-eye" transform="translate({eye_px:.1f}, {eye_py:.1f})">
      <circle cx="0" cy="0" r="3.2" fill="#040914" stroke="#38BDF8" stroke-width="1.2"/>
      <circle cx="0.5" cy="-0.5" r="1.3" fill="#FFFFFF"/>
    </g>

    <!-- Rising Ocean Bubbles -->
    <g id="bubbles" opacity="0.8">
      <circle class="bubble-1" cx="{offset_x + (36-min_x)*pitch}" cy="{offset_y + 30}" r="3" fill="none" stroke="#38BDF8" stroke-width="1"/>
      <circle class="bubble-2" cx="{offset_x + (34-min_x)*pitch + 5}" cy="{offset_y + 20}" r="2" fill="none" stroke="#7DD3FC" stroke-width="0.9"/>
      <circle class="bubble-3" cx="{offset_x + (38-min_x)*pitch - 4}" cy="{offset_y + 15}" r="2.5" fill="none" stroke="#67E8F9" stroke-width="1"/>
      <circle class="bubble-4" cx="{offset_x + (28-min_x)*pitch}" cy="{offset_y + (14-min_y)*pitch}" r="2.2" fill="none" stroke="#38BDF8" stroke-width="0.8"/>
      <circle class="bubble-5" cx="{offset_x + (15-min_x)*pitch}" cy="{offset_y + (12-min_y)*pitch}" r="2.8" fill="none" stroke="#0EA5E9" stroke-width="0.9"/>
    </g>
  </g>

  <!-- Footer / Legend Section -->
  <g id="footer" transform="translate(38, {svg_height - 30})">
    <text x="0" y="10" class="meta-text">⚡ 367 days mapped into an ocean blue whale silhouette</text>

    <!-- Right Intensity Legend -->
    <g transform="translate({svg_width - 250}, 0)">
      <text x="-32" y="10" class="legend-text">Less</text>
      <rect x="0" y="0" width="11" height="11" rx="2" fill="{colors[0]['fill']}" stroke="{colors[0]['stroke']}" stroke-width="0.8"/>
      <rect x="15" y="0" width="11" height="11" rx="2" fill="{colors[1]['fill']}" stroke="{colors[1]['stroke']}" stroke-width="0.8"/>
      <rect x="30" y="0" width="11" height="11" rx="2" fill="{colors[2]['fill']}" stroke="{colors[2]['stroke']}" stroke-width="0.8"/>
      <rect x="45" y="0" width="11" height="11" rx="2" fill="{colors[3]['fill']}" stroke="{colors[3]['stroke']}" stroke-width="0.8"/>
      <rect x="60" y="0" width="11" height="11" rx="2" fill="{colors[4]['fill']}" stroke="{colors[4]['stroke']}" stroke-width="0.8"/>
      <text x="78" y="10" class="legend-text">More</text>
    </g>
  </g>
</svg>"""

    for out_p in output_paths:
        os.makedirs(os.path.dirname(out_p) if os.path.dirname(out_p) else ".", exist_ok=True)
        with open(out_p, "w", encoding="utf-8") as f:
            f.write(svg_content)
        print(f"Generated {out_p} ({len(svg_content)} bytes)")

if __name__ == "__main__":
    import sys
    user = sys.argv[1] if len(sys.argv) > 1 else "hirunipraboda"
    paths = [
        "github-whale-contributions.svg",
        "dist/github-whale-contributions.svg"
    ]
    generate_whale_svg(user, paths)

