find ./ -name ".DS_Store" -depth -exec rm {} \;
zip -r mojohelpdesk-chrome-extension.zip ./  -x "*.git*" -x "*/\.*" -x "screenshots/*" -x "build.sh" -x ".DS_Store"
