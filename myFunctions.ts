// تعريف واجهة للبيانات المنقولة لزيادة قوة الكود في TypeScript
// (تمت إزالتها في JS، ولكن بقيت كتعليق توضيحي)
// interface NewApplicationData { ... }

// دالة تفاصيل افتراضية لتفادي الأخطاء على الأزرار الموجودة
function showDetails(button) {
    const row = $(button).closest('tr');
    const name = row.find('td:eq(0)').text();
    const url = row.find('td:eq(0)').data('url');
    const desc = row.find('td:eq(0)').data('short-desc');

    alert(`
        تفاصيل التطبيق: ${name}
        الوصف: ${desc}
        الرابط: ${url}
    `);
}


// استخدام jQuery للتحقق من تحميل الصفحة بالكامل
$(document).ready(function () {
    console.log("jQuery جاهز للعمل.");

    // منطق خاص بصفحة apps.html
    if (window.location.pathname.endsWith("apps.html")) {
        // ربط الدالة بزر المتابعة في صفحة apps.html باستخدام jQuery
        $("#continueBtn").click(function (e) {
            e.preventDefault();
            validateAndContinue();
        });
        
        // محاولة عرض التطبيق المضاف حديثاً
        displayNewApplication();
    }
    
    // منطق خاص بصفحة add_app.html
    if (window.location.pathname.endsWith("add_app.html")) {
         // ربط دالة الإرسال بزر الإرسال في صفحة add_app.html
        $("#newAppForm").submit(function (e) {
            e.preventDefault(); // منع الإرسال الافتراضي
            validateAndSubmitApp();
        });
    }
});

/**
 * دالة للتحقق من صحة المدخلات في نموذج apps.html ووظيفة المتابعة
 */
function validateAndContinue() {
    let isValid = true;

    // 1. التحقق من اختيار عنصر واحد في الجدول باستخدام jQuery
    if ($('input[name="select_app"]:checked').length === 0) {
        alert("الرجاء اختيار تطبيق واحد من الجدول للمتابعة.");
        isValid = false;
    }

    // 2. استخدام جافاسكريبت لنقل المعلومات
    if (isValid) {
        // يتم استخدام 'as string' في TypeScript لكن في JS نعتمد على القيمة
        const selectedApp = $('input[name="select_app"]:checked').val(); 

        // تخزين القيمة في الذاكرة المحلية (localStorage)
        localStorage.setItem('SelectedApplication', selectedApp);

        alert(`تم اختيار التطبيق: ${ selectedApp }.يمكن المتابعة الآن.`);
    }

    return isValid;
}

/**
 * دالة للتحقق من صحة المدخلات في نموذج add_app.html وإرسالها
 */
function validateAndSubmitApp() {
    let isValid = true;
    
    // الحصول على القيم
    const appName = $('#appName').val();
    const companyName = $('#companyName').val();
    const appURL = $('#appURL').val();
    const usageArea = $('#usageArea').val();
    const appDesc = $('#appDesc').val();
    const isFree = $('#isFree').prop('checked') ? 'مجاني' : 'غير مجاني';

    // التحقق من الحقول المطلوبة والصيغ (أحرف إنجليزية فقط)
    const englishRegex = /^[A-Za-z\s]+$/;
    if (!englishRegex.test(appName) || !englishRegex.test(companyName)) {
        alert("يجب أن يحتوي اسم التطبيق واسم الشركة على أحرف إنجليزية ومسافات فقط.");
        isValid = false;
    }

    // التأكد من أن جميع الحقول المطلوبة مملوءة
    if (!appName || !companyName || !appURL || !usageArea || !appDesc) {
        // التحقق الأساسي من الـ HTML كافٍ لكن هذا تأكيد
        if (isValid) {
             alert("الرجاء ملء جميع الحقول المطلوبة.");
        }
        isValid = false;
    }

    if (isValid) {
        // تجميع بيانات التطبيق
        const newAppInfo = {
            name: appName,
            company: companyName,
            url: appURL,
            area: usageArea,
            isFree: isFree,
            description: appDesc
        };

        // استخدام localStorage لنقل البيانات
        transferData('NewApplicationData', JSON.stringify(newAppInfo));

        // رسالة نجاح
        alert(`تم إدخال بيانات التطبيق بنجاح: ${appName}.\nسيتم النقل إلى صفحة التطبيقات.`);
        
        // الانتقال إلى الصفحة السابقة (apps.html)
        window.location.href = "apps.html";
    }

    return isValid;
}


/**
 * دالة لعرض التطبيق المضاف حديثاً في صفحة التطبيقات
 */
function displayNewApplication() {
    const newAppJson = localStorage.getItem('NewApplicationData');
    
    // التأكد من وجود بيانات
    if (newAppJson) {
        try {
            const newApp = JSON.parse(newAppJson);
            
            // إنشاء صف HTML جديد لعرض البيانات
            const newRow = `
                <tr class="newly-added-app">
                    <td data-url="${newApp.url}" data-short-desc="${newApp.description}" data-media="">${newApp.name}</td>
                    <td>${newApp.company}</td>
                    <td>${newApp.area}</td>
                    <td><input type="checkbox" name="free_app_new" ${newApp.isFree === 'مجاني' ? 'checked' : ''} disabled> ${newApp.isFree}</td>
                    <td><input type="radio" name="select_app" value="${newApp.name}"></td>
                    <td><button class="details-btn" onclick="showDetails(this)">إظهار التفاصيل</button></td>
                </tr>
            `;

            // إضافة الصف إلى جسم الجدول
            $('#appsTableBody').prepend(newRow); 
            
            // تنظيف localStorage لضمان عدم تكرار العرض عند تحديث الصفحة
            localStorage.removeItem('NewApplicationData');
            
        } catch (e) {
            console.error("خطأ في تحليل بيانات التطبيق المضافة:", e);
            localStorage.removeItem('NewApplicationData'); 
        }
    }
}


// دالة لنقل المعلومات من صفحة إلى أخرى عند اللزوم (تستخدمها دالة الإرسال)
function transferData(key, value) {
    localStorage.setItem(key, value);
    console.log(`تم تخزين القيمة ${ value } للمفتاح ${ key }`);
}