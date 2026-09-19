import React, { useRef, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface NoiseHeatmapProps {
  dataPoints: [number, number, number][]; // [latitude, longitude, intensity]
}

export default function NoiseHeatmap({ dataPoints }: NoiseHeatmapProps) {
  const webViewRef = useRef<WebView>(null);

  // Send updated data points dynamically to the WebView map
  useEffect(() => {
    if (webViewRef.current && dataPoints) {
      const jsonPoints = JSON.stringify(dataPoints);
      // Injects javascript safely. `true;` at the end prevents return value issues on some OS versions.
      webViewRef.current.injectJavaScript(`
        if (typeof updateHeatmap === 'function') {
          updateHeatmap(${jsonPoints});
        }
        true;
      `);
    }
  }, [dataPoints]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; background: #1a1a1a; }
        .leaflet-container {
          background: #1a1a1a !important;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>

      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js"></script>
      
      <script>
        // Initialize the map centered around Lahore, Pakistan
        const map = L.map('map', { zoomControl: false }).setView([31.5204, 74.3587], 13);

        // Add standard OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Initialize empty heatmap layer
        let heatmapLayer = L.heatLayer([], {
          radius: 70,
          blur: 35,
          maxZoom: 17,
          // Gradient mapping for decibel intensity
          gradient: { 0.4: '#7B2FF7', 0.6: '#5A1FD4', 0.8: '#B76EFF', 1.0: '#E53E3E' }
        }).addTo(map);

        // Global function triggered by React Native to update points
        function updateHeatmap(points) {
          try {
            if (!Array.isArray(points)) return;
            heatmapLayer.setLatLngs(points);
            
            if (points.length > 0) {
              const bounds = L.latLngBounds(points.map(p => [p[0], p[1]]));
              map.fitBounds(bounds, { padding: [50, 50] });
            }
          } catch (e) {
            console.error('Error updating heatmap:', e);
          }
        }
      </script>
    </body>
    </html>
  `;

  const WebViewComponent = WebView as any;

  return (
    <View style={styles.container}>
      <WebViewComponent
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadEnd={() => {
          // Immediately sync current data points after page load finishes
          if (dataPoints && dataPoints.length > 0) {
            const jsonPoints = JSON.stringify(dataPoints);
            webViewRef.current?.injectJavaScript(`
              if (typeof updateHeatmap === 'function') {
                updateHeatmap(${jsonPoints});
              }
              true;
            `);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  map: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
