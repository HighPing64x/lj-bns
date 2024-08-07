// webcounter.js

// 使用一个对象来存储访问记录和访问次数
let visitData = {};
let totalVisits = 0;

// 太平洋网络IP地址查询API接口
const ipInfoApi = 'http://whois.pconline.com.cn/ipJson.jsp?json=true';

// 访问网站时调用的函数
function logVisit() {
    // 获取访问时间
    const now = new Date();
    const dateStr = formatDate(now);

    // 获取访问者的IP地址（这里用一个示例IP）
    const ipAddress = '123.123.123.123'; // Replace with actual IP detection logic

    // 获取IP地址对应的地理位置信息
    fetch(`${ipInfoApi}&ip=${ipAddress}`)
        .then(response => response.json())
        .then(data => {
            const addressInfo = formatAddress(data);

            // 记录访问次数
            if (!visitData[ipAddress]) {
                visitData[ipAddress] = 1;
            } else {
                visitData[ipAddress]++;
            }
            totalVisits++;

            // 构建访问信息的HTML字符串
            const visitHtml = `<p>[${dateStr}]::[${ipAddress}][${addressInfo}]</p>`;

            // 将访问信息追加到页面末尾
            const visitContainer = document.getElementById('visitContainer');
            if (visitContainer) {
                visitContainer.innerHTML += visitHtml;
            }

            // 更新网站总访问量信息
            updateTotalVisits();
        })
        .catch(error => console.error('Error fetching IP info:', error));
}

// 格式化日期时间
function formatDate(date) {
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${day}/${month}/${year}[${hours}:${minutes}:${seconds}]`;
}

// 格式化IP地址对应的地址信息
function formatAddress(ipInfo) {
    // 太平洋网络IP查询接口返回的数据格式为 {"pro":"北京市","proCode":"110000","city":"北京市","cityCode":"110100","region":"","regionCode":"0","addr":"北京市 电信","regionNames":"","err":""}
    // 根据 "pro" 和 "country" 字段判断地址信息
    if (ipInfo.pro) {
        return `${ipInfo.pro} ${ipInfo.city}`;
    } else if (ipInfo.country) {
        return `${ipInfo.country}`;
    } else {
        return `Unknown`;
    }
}

// 更新网站总访问量信息
function updateTotalVisits() {
    const totalVisitsHtml = `<p>[LOCAL][WEB]::[LJBNS][${totalVisits}次]</p>`;
    const totalVisitsContainer = document.getElementById('totalVisitsContainer');
    if (totalVisitsContainer) {
        totalVisitsContainer.innerHTML = totalVisitsHtml;
    }
}

// 初始化页面加载时记录访问
logVisit();
