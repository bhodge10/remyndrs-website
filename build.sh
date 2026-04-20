#!/bin/bash
# Netlify build script: auto-generate sitemap.xml and ping Google

DOMAIN="https://remyndrs.com"
TODAY=$(date -u +"%Y-%m-%d")

# Pages to exclude from sitemap
EXCLUDE="payment-success.html payment-cancelled.html admin/index.html"

# High-priority pages (weekly crawl, priority 1.0)
HIGH_PRIORITY="index.html"

# Medium-priority pages (monthly crawl, priority 0.7)
MEDIUM_PRIORITY="faq.html commands.html"

# Everything else gets low priority (yearly crawl, priority 0.3)

echo "Generating sitemap.xml..."

cat > sitemap.xml <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
EOF

for file in $(find . -name "*.html" -not -path "*/node_modules/*" -not -path "./.netlify/*" -not -path "./Artifacts/*" -not -path "./Claude Artifacts/*" | sed 's|^\./||' | sort); do
  # Check if file is in exclude list
  skip=false
  for ex in $EXCLUDE; do
    if [ "$file" = "$ex" ]; then
      skip=true
      break
    fi
  done
  if $skip; then
    continue
  fi

  # Build URL path
  if [ "$file" = "index.html" ]; then
    url="$DOMAIN/"
  else
    url="$DOMAIN/$file"
  fi

  # Determine priority and changefreq
  changefreq="yearly"
  priority="0.3"
  for hp in $HIGH_PRIORITY; do
    if [ "$file" = "$hp" ]; then
      changefreq="weekly"
      priority="1.0"
      break
    fi
  done
  for mp in $MEDIUM_PRIORITY; do
    if [ "$file" = "$mp" ]; then
      changefreq="monthly"
      priority="0.7"
      break
    fi
  done

  cat >> sitemap.xml <<EOF
  <url>
    <loc>$url</loc>
    <lastmod>$TODAY</lastmod>
    <changefreq>$changefreq</changefreq>
    <priority>$priority</priority>
  </url>
EOF
done

cat >> sitemap.xml <<EOF
</urlset>
EOF

echo "Sitemap generated with $(grep -c '<url>' sitemap.xml) URLs:"
grep '<loc>' sitemap.xml | sed 's|.*<loc>||;s|</loc>.*||'

echo ""
echo "Done!"
