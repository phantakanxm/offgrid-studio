#!/bin/sh
# Converts the source PNG renders in the project root into the WebP paths the site expects.
# Rerunnable: every target is regenerated from its source. Missing sources are reported, not faked.
set -eu
cd "$(dirname "$0")/.."

missing=0
convert_one() {
  src="$1"
  dest="public/images/$2"
  if [ ! -f "$src" ]; then
    echo "missing source: $src -> $dest" >&2
    missing=$((missing + 1))
    return
  fi
  mkdir -p "$(dirname "$dest")"
  cwebp -quiet -q 82 -m 6 -metadata none "$src" -o "$dest"
  echo "$dest"
}

convert_one "Neon Lime Twisted Ribbon Sculpture.png"           offgrid/hero-sculpture.webp
convert_one "Neon Chartreuse Interlocking Ribbon Sculpture.png" offgrid/sculpture-detail.webp
convert_one "Industrial Creative Studio Workspace.png"          offgrid/studio-workspace.webp
convert_one "Sunlit Industrial Design Studio.png"               offgrid/studio-process.webp
convert_one "Neon Geometry on Cream Canvas.png"                 offgrid/graphic-texture.webp
convert_one "Angular Orange Ribbon Sculpture.png"               offgrid/orange-object.webp

convert_one "Brutalist Redlight Techwear Portrait.png"          projects/rift/hero.webp
convert_one "Brutalist Redlight Streetwear Portrait.png"        projects/rift/editorial.webp
convert_one "Moody Black Techwear Editorial Portrait.png"       projects/rift/detail.webp

convert_one "Neon Ribbon Torus in the Shadows.png"              projects/frequency/hero.webp
convert_one "Neon Infinity Stage in a Packed Arena.png"         projects/frequency/live.webp
convert_one "Neon Iridescent Ribbon Vortex.png"                 projects/frequency/detail.webp

convert_one "Minimalist Warm Glow Lamp.png"                     projects/mono/hero.webp
convert_one "Sculptural Lamp in Warm Light.png"                 projects/mono/editorial.webp
convert_one "Sculptural Brushed Metal Lamp Glow.png"            projects/mono/detail.webp

convert_one "Blue and Orange Geometric Gallery Sculpture.png"   projects/signal/hero.webp
convert_one "Geometric Sculpture in Sunlit Gallery.png"         projects/signal/exhibition.webp
convert_one "Cobalt Pillar and Orange Arc.png"                  projects/signal/detail.webp

# Open Graph cards: JPEG, because several social crawlers still ignore WebP.
og_card() {
  src="$1"
  dest="public/og/$2"
  [ -f "$src" ] || return 0
  mkdir -p public/og
  magick "$src" -resize 1200x630^ -gravity center -extent 1200x630 -strip -quality 84 "$dest"
  echo "$dest"
}

og_card "Neon Lime Twisted Ribbon Sculpture.png"         offgrid.jpg
og_card "Brutalist Redlight Techwear Portrait.png"        rift.jpg
og_card "Neon Ribbon Torus in the Shadows.png"            frequency.jpg
og_card "Minimalist Warm Glow Lamp.png"                   mono.jpg
og_card "Blue and Orange Geometric Gallery Sculpture.png" signal.jpg
og_card "Industrial Creative Studio Workspace.png"          studio.jpg

if [ "$missing" -gt 0 ]; then
  echo "$missing source file(s) missing; the site renders labelled placeholders for them." >&2
fi
