
let map;
let markers = [];
let info;

const locationItems = document.querySelectorAll(".item-list .item");
let locationArr = [];
locationItems.forEach((item, index) => {
    locationArr.push({
        title: item.dataset.title,
        lat: Number(item.dataset.lat),
        lng: Number(item.dataset.lng),
        floor_space: item.dataset.floorSpace,
        loc_img: item.dataset.locImg,
        loc_url: item.dataset.url
    });
});
console.log(locationArr);

const infoPopup = (title, floor_space, loc_img, loc_url) => {
    return `
        <div class="dt_box">
            <div class="img_box">
                <img src="${loc_img}" alt="">
            </div>
            <div class="flex_box">
                <div class="left">
                    <h2 class="title ff-noto-serif-tc">${title}</h2>
                    <p class="txt ff-microsoft-jhenghei">坪數規劃：${floor_space}</p>
                </div>
                <div class="right">
                    <a class="loc_btn ff-microsoft-jhenghei" href="${loc_url}" target="_blank">基地位置</a>
                </div>
            </div>
        </div>
    `;
};

async function initMap() {
    // ✅ 等待 API 完成載入（如果支援 importLibrary）
    if (google.maps && typeof google.maps.importLibrary === 'function') {
        await google.maps.importLibrary("maps");
        await google.maps.importLibrary("marker");
    }

    // ✅ 地圖中心座標
    const position = { lat: 24.91090103508536, lng: 121.20882989191385 };

    // ✅ 建立地圖
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 11,
        center: position,
        mapId: "9bd1f1a3672a07a1104a62ef" // 若有雲端地圖樣式，可填自己的 Map ID
    });
    console.log(map);

    info = new google.maps.InfoWindow();
    const listEl = document.getElementById("list");

    let activeInfoWindow = null;

    locationArr.forEach((loc, i) => {
        console.log(loc);
        //-- 座標 --
        const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat: loc.lat, lng: loc.lng },
            title: loc.title
        });

        // 加到陣列方便控制
        markers.push(marker);

        //-- 座標彈出視窗 --
        info.setContent(
            infoPopup(loc.title, loc.floor_space, loc.loc_img, loc.loc_url)
        );

        //-- 座標點擊事件 --
        marker.addEventListener("click", (e) => {
            e.stopPropagation();
            openInfo(i);
        });
    });
}

locationItems.forEach((item, index) => {
    item.addEventListener("click", (e) => {
        openInfo(index);

        if(ucyCore.isMobile()) {
            const mapElement = document.getElementById("map");
            const headerElement = document.querySelector(".header");
            if(mapElement) {
                const headerHeight = headerElement ? headerElement.offsetHeight : 0;
                const targetY = mapElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                const startY = window.pageYOffset;
                
                gsap.to({ y: startY }, {
                    y: targetY,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onUpdate: function() {
                        window.scrollTo(0, this.targets()[0].y);
                    }
                });
            }
        }
    });
});

function openInfo(index) {
    // console.log(index);
    const loc = locationArr[index];
    const marker = markers[index];

    // 關閉舊的 InfoWindow
    info.close();

    // // 設定新的內容
    info.setContent(
        infoPopup(loc.title, loc.floor_space, loc.loc_img, loc.loc_url)
    );

    // 打開新的
    info.open(map, marker);

    // 平移地圖
    setTimeout(() => {
        // map.panTo(marker.position);
    }, 500);

}

// 等待 Google Maps API 載入完成後再執行 initMap
if (window.initGoogleMap) {
    window.initGoogleMap.then(() => {
        initMap();
    });
} else {
    // 如果 Promise 不存在，直接執行（向後兼容）
    initMap();
}

window.onload = function () {
    const window_width = window.screen.width;
    const vh = window.innerHeight; // 視窗高度
    gsap.registerPlugin(ScrollTrigger, SplitText);

    
    ucyCore.pageBanner.bannerAni(".push-map-body");
    document.fonts.ready.then(() => {
        ucyCore.pageTitle.titleAni(".push-map-body");
    });
    
    if(!ucyCore.isMobile()) {
        ScrollTrigger.create({
            // markers: true,
            trigger: ".push-map-wrap",
            pin: true,
            start: "top-=12% top",
            end: "50% bottom",
        });
    }
};
