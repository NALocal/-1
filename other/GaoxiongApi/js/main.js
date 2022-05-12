let data;

const headerSelect = document.querySelector('.header_form');
const sectionList = document.querySelector('.section_hotbox_list');
const area = ['全部景點', '三民區', '美濃區', '大樹區', '小港區', '六龜區', '仁武區', '內門區', '左營區', '田寮區', '甲仙區', '杉林區', '岡山區', '前金區', '前鎮區', '苓雅區', '茂林區', '茄萣區', '梓官區', '新興區', '楠梓區', '鼓山區', '旗津區', '鳳山區'];

const travelTitle = document.querySelector('.travel_title');
const travelList = document.querySelector('.travel_list');
const travelPage = document.querySelector('.travel_page');

const goTopBtn = document.querySelector('.gotop');

function displayCount() {
  try { document.createEvent("TouchEvent"); return 4; }
  catch (e) { return 10; }
}

// 一頁顯示數量
const onePage = displayCount();
// 總頁數
let totalPage = 0;
// 當前頁碼
let nowPage = 0;


// 下拉選單行政區
function getOption() {
  const areaLen = area.length;
  for (let i = 0; i < areaLen; i++) {
    let areaName = area[i];
    const str = document.createElement('option');
    str.textContent = areaName;
    str.setAttribute('value', areaName);
    headerSelect.appendChild(str);
  }
}

getOption();

// 使用 AJAX
const xhr = new XMLHttpRequest();
xhr.open('get', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true);
xhr.send(null);
xhr.onload = function () {
  data = JSON.parse(xhr.responseText)['result']['records'];
  showList(); // 執行取得景點資料
}


function showList(e) {
  let temp = [];
  let str = '';
  let select;
  let pageValue;

  if (!e) {
    if (localStorage.getItem('select') === null) localStorage.setItem('select', area[0]);
    select = localStorage.getItem('select');
    nowPage = 0;
  } else if (e.target.nodeName !== 'A' && e.target.nodeName !== 'SELECT') {
    return;
  } else if (e.target.nodeName === 'A') {
    e.preventDefault();
    // 換頁
    if (e.path[2].classList[0] === 'travel_page') {
      switch (e.target.dataset.num) {
        case 'prev':
          if (nowPage !== 0) nowPage--;
          break;
        case 'next':
          if (nowPage !== totalPage - 1) nowPage++;
          break;
        default:
          nowPage = e.target.dataset.num - 1;
          break;
      }
      select = localStorage.getItem('select');
    } else {
      nowPage = 0;
      select = e.target.innerHTML;
    }
  }
  // SELECT
  else {
    nowPage = 0;
    select = e.target.value;
  }
  localStorage.setItem('select', select);

  for (let i = 0; i < data.length; i++) {

    if (select === data[i]["Zone"]) {
      travelTitle.innerHTML = data[i]["Zone"];
      temp.push(data[i]);

    } else if (select === area[0]) {
      travelTitle.innerHTML = area[0];
      temp.push(data[i]);

    } else if (temp.length === 0) {
      travelTitle.innerHTML = '您選擇的行政區沒有景點';
    }
  }

  totalPage = Math.ceil(temp.length / onePage);
  pageValue = onePage * nowPage;

  for (let j = pageValue; j < temp.length; j++) {
    if (j > pageValue + onePage - 1) break;
    str +=
      '<li><div class="travel_list_img" style="background-image: url(' +
      temp[j]["Picture1"] +
      ');"><div class="travel_list_title" ><h4>' +
      temp[j]['Name'] +
      '</h4><p>' +
      temp[j]["Zone"] +
      '</p></div></div><div class="travel_list_text"><ul><li><span class="icons"><img src="images/icons_clock.png" alt=""></span>' +
      temp[j]['Opentime'] +
      '</li ><li><span class="icons"><img src="images/icons_pin.png" alt=""></span>' +
      temp[j]['Add'] +
      '</li><li><span class="icons"><img src="images/icons_phone.png" alt=""></span>' +
      temp[j]['Tel'] +
      '</li></ul><ul><li><span class="icons"><img src="images/icons_tag.png" alt=""></span>' +
      (temp[j]['Ticketinfo'] === "" ? "　　　　" : temp[j]['Ticketinfo']) +
      '</li></ul></div></li>';
  }
  travelList.innerHTML = str;

  if (nowPage === 0) str = '<li><a data-num="prev" class="Noclick" href="#">< prev</a></li>';
  else str = '<li><a data-num="prev" href="#">< prev</a></li>';

  for (let k = 0; k < totalPage; k++) {
    if (k === nowPage) str += '<li><a data-num="' + (k + 1) + '" class="highlight" href="#">' + (k + 1) + '</a></li>';
    else str += '<li><a data-num="' + (k + 1) + '" href="#">' + (k + 1) + '</a></li>';
  }

  if (nowPage === totalPage - 1 || totalPage === 0) str += '<li><a data-num="next" class="Noclick" href="#">next ></a></li>';
  else str += '<li><a data-num="next" href="#">next ></a></li>';
  travelPage.innerHTML = str;
}


function goTop(e) {
  e.preventDefault();
  if (e.target.offsetParent.classList.value == 'gotop') {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}

headerSelect.addEventListener('change', showList);
sectionList.addEventListener('click', showList);
travelPage.addEventListener('click', showList);

goTopBtn.addEventListener('click', goTop);