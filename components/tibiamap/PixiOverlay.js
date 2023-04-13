/**
 * Copied from https://github.com/knapcio/react-leaflet-pixi-overlay
 * so it won't require React 17 as dependency
 */

import { useEffect, useState } from "react";
//leaflet
import L from "leaflet";

//pixi-overlay
import * as PIXI from "pixi.js";
import "leaflet-pixi-overlay";

// react-leaflet
import { useMap } from "react-leaflet";

PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;
// pixi.js v5
PIXI.utils.skipHello();
const PIXILoader = PIXI.Loader.shared;

const PixiOverlay = ({ markers }) => {
  const [openedPopupData, setOpenedPopupData] = useState(null);
  const [openedTooltipData, setOpenedTooltipData] = useState(null);

  const [openedPopup, setOpenedPopup] = useState(null);
  const [openedTooltip, setOpenedTooltip] = useState(null);

  const [pixiOverlay, setPixiOverlay] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const map = useMap();

  if (map.getZoom() === undefined) {
    // this if statment is to avoid getContainer error
    // map must have zoom prop
    console.error(
      "no zoom found, add zoom prop to map to avoid getContainer error",
    );
    return null;
  }

  // load sprites
  useEffect(function loadSprites() {
    (async () => {
      // cancel loading if already loading as it may cause: Error: Cannot add resources while the loader is running.
      if (PIXILoader.loading) {
        PIXILoader.reset();
      }

      let loadingAny = false;
      for (let marker of markers) {
        const resolvedMarkerId = marker.icon.id || marker.icon.color;

        // skip if no ID or already cached
        if (
          (!marker.icon.color && !marker.icon.id) ||
          PIXILoader.resources[`marker_${resolvedMarkerId}`]
        ) {
          continue;
        }
        loadingAny = true;
        const icon = await getEncodedIcon(marker?.icon?.image || getDefaultIconSvg(marker.icon.color), marker.icon.type);

        // wait for pixiloader to stop loading
        await new Promise((resolve) => {
          if (!PIXILoader.loading) {
            resolve();
          } else {
            PIXILoader.onComplete.once(resolve);
          }
        });

        // check if resource already exists
        if (PIXILoader.resources[`marker_${resolvedMarkerId}`]) {
          continue;
        }

        PIXILoader.add(`marker_${resolvedMarkerId}`, icon);
      }
      if (loaded && loadingAny) {
        setLoaded(false);
      }

      if (loadingAny) {
        PIXILoader.load(() => setLoaded(true));
      } else {
        setLoaded(true);
      }
    })();
  }, [markers]);

  // load pixi when map changes
  useEffect(() => {
    let pixiContainer = new PIXI.Container();
    let overlay = L.pixiOverlay((utils) => {
      // redraw markers
      const scale = utils.getScale();
      utils
        .getContainer()
        .children.forEach((child) => child.scale.set(1 / scale));

      utils.getRenderer().render(utils.getContainer());
    }, pixiContainer);
    overlay.addTo(map);
    setPixiOverlay(overlay);

    setOpenedPopupData(null);
    setOpenedTooltipData(null);

    return () => pixiContainer.removeChildren();
  }, [map]);

  // draw markers first time in new container
  useEffect(() => {
    if (pixiOverlay && markers && loaded) {
      const utils = pixiOverlay.utils;
      let container = utils.getContainer();
      let renderer = utils.getRenderer();
      let project = utils.latLngToLayerPoint;
      let scale = utils.getScale();

      markers.forEach((marker) => {
        const {
          id,
          icon,
          // iconColor,
          // iconId,
          onClick,
          position,
          popup,
          tooltip,
          tooltipOptions,
          popupOpen,
          markerSpriteAnchor,
          angle
        } = marker;

        const resolvedIconId = icon.id || icon.color;

        if (
          !PIXILoader.resources[`marker_${resolvedIconId}`] ||
          !PIXILoader.resources[`marker_${resolvedIconId}`].texture
        ) {
          return;
        }

        const markerTexture =
          PIXILoader.resources[`marker_${resolvedIconId}`].texture;
        //const markerTexture = new PIXI.Texture.fromImage(url);

        markerTexture.anchor = { x: 0.5, y: 1 };

        const markerSprite = PIXI.Sprite.from(markerTexture);
        if (markerSpriteAnchor) {
          markerSprite.anchor.set(markerSpriteAnchor[0], markerSpriteAnchor[1]);
        } else {
          markerSprite.anchor.set(0.5, 1);
        }

        const markerCoords = project(position);
        markerSprite.x = markerCoords.x;
        markerSprite.y = markerCoords.y;
        markerSprite.zIndex = 9999;

        if (angle) {
          markerSprite.angle = angle;
        }

        markerSprite.scale.set(1 / scale);

        if (popupOpen) {
          setOpenedPopupData({
            id,
            offset: [0, -35],
            position,
            content: popup,
            onClick,
          });
        }

        if (popup || onClick || tooltip) {
          markerSprite.interactive = true;
        }

        if (popup || onClick) {
          // Prevent accidental launch of onClick event when dragging the map.
          // Detect very small moves as clicks.
          markerSprite.on("mousedown", () => {
            let moveCount = 0;
            markerSprite.on("mousemove", () => {
              moveCount++;
            });
            markerSprite.on("mouseup", () => {
              if (moveCount < 2 && onClick) {
                onClick(id);
              }
            });
          });
          // Prevent the same thing on touch devices.
          markerSprite.on("touchstart", () => {
            let moveCount = 0;
            markerSprite.on("touchmove", () => {
              moveCount++;
            });
            markerSprite.on("touchend", () => {
              if (moveCount < 10 && onClick) {
                onClick(id);
              }
            });
          });

          markerSprite.defaultCursor = "pointer";
          markerSprite.buttonMode = true;
        }

        if (tooltip) {
          markerSprite.on("mouseover", () => {
            setOpenedTooltipData({
              id,
              offset: [0, -35],
              position,
              content: tooltip,
              tooltipOptions: tooltipOptions || {}
            });
          });

          markerSprite.on("mouseout", () => {
            setOpenedTooltipData(null);
          });
        }

        container.addChild(markerSprite);
      });

      renderer.render(container);
    }

    return () =>
      pixiOverlay && pixiOverlay.utils.getContainer().removeChildren();
  }, [pixiOverlay, markers, loaded]);
  // handle tooltip
  useEffect(() => {
    if (openedTooltip) {
      map.removeLayer(openedTooltip);
    }

    if (
      openedTooltipData &&
      (!openedPopup ||
        !openedPopupData ||
        openedPopupData.id !== openedTooltipData.id)
    ) {
      setOpenedTooltip(openTooltip(map, openedTooltipData));
    }

    // we don't want to reload when openedTooltip changes as we'd get a loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedTooltipData, openedPopupData, map]);

  // handle popup
  useEffect(() => {
    // close only if different popup
    if (openedPopup) {
      map.removeLayer(openedPopup);
    }

    // open only if new popup
    if (openedPopupData) {
      setOpenedPopup(
        openPopup(map, openedPopupData, { autoClose: false }, true),
      );
    }

    // we don't want to reload when whenedPopup changes as we'd get a loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openedPopupData, map]);

  return null;
};

function openPopup(map, data, extraOptions = {}, isPopup) {
  const popup = L.popup(Object.assign({ offset: data.offset }, extraOptions))
    .setLatLng(data.position)
    .setContent(data.content)
    .addTo(map);

  // TODO don't call onClick if opened a new one
  if (isPopup && data.onClick) {
    popup.on("remove", () => {
      data.onClick(null);
    });
  }

  return popup;
}

function openTooltip(map, data) {
  const tooltip = L.tooltip(Object.assign({ offset: data.offset }, data.tooltipOptions))
    .setLatLng(data.position)
    .setContent(data.content)
    .addTo(map);

  return tooltip;
}

function getDefaultIconSvg(color) {
  const svgIcon = `<svg style="-webkit-filter: drop-shadow( 2px 2px 2px rgba(0,0,0,.6));filter: drop-shadow( 2px 2px 2px rgba(0,0,0,.6)); opacity: 0.9" xmlns="http://www.w3.org/2000/svg" fill="${color || 'yellow'}" width="36" height="36" viewBox="0 0 24 24"><path d="M12 0c-4.198 0-8 3.403-8 7.602 0 6.243 6.377 6.903 8 16.398 1.623-9.495 8-10.155 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.342-3 3-3 3 1.343 3 3-1.343 3-3 3z"/></svg>`;
  return svgIcon;
}

async function getEncodedIcon(icon, type) {
  const { getImageData } = iconTypes[type] || iconTypes.svg;
  return await getImageData(icon);
}

const iconTypes = {
  svg: {
    getImageData: async (svg) => {
      const prefix = 'data:image/svg+xml;base64,';
      const decoded = unescape(encodeURIComponent(svg));
      const base64 = btoa(decoded);
      return `${prefix}${base64}`;
    }
  },
  png: {
    getImageData: async (pngUrl, {
      contextSettings = {
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        shadowColor: 'rgba(0,0,0,0.6)',
        shadowBlur: 2,
      }
    } = {}) => {

      const img = new Image();
      img.src = pngUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.width + contextSettings?.shadowOffsetX || 0;
      canvas.height = img.height + contextSettings?.shadowOffsetY || 0;

      const ctx = canvas.getContext('2d');

      Object.entries(contextSettings || {}).forEach(([key, value]) => {
        ctx[key] = value;
      });
      ctx.drawImage(img, 0, 0);

      return canvas.toDataURL('image/png');

    }
  },
}

export default PixiOverlay;