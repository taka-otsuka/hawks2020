// フォームの取得
const form = document.getElementById('form');

// カスタム項目
const fieldList = {
  ChangeContent:'00N0I00000KoFoQ' // 申請内容
  ,FacultyName:'00N0I00000KoFnN' // 学部名
  ,AlumnusNumber:'00N0I00000KoFnD' // 校友番号
  ,GraduationYears:'00N0I00000KoFnI' // 卒年
  ,Birthday:'00N0I00000KoFoG' // 生年月日
  ,Name_Kana:'00N0I00000KoFn3' // 氏名(ｶﾅ)
  ,OldLastName:'00N0I00000KoFn8' // 旧姓
  ,EmailAddress:'00N0I00000KoFnS' // メールアドレス
  ,CurrentAddress04:'00N0I00000KoFnX' // 番地名
  ,CurrentAddress05:'00N0I00000KoFnc' // マンション名
  ,CurrentOfficeCorporateName:'00N0I00000KoFoB' // 現勤務先－企業名
  ,CurrentOfficePostalCode:'00N0I00000KoFmz' // 現勤務先－郵便番号
  ,CurrentOfficeAddress01:'00N0I00000KoFnh' // 現勤務先－住所１（都道府県名）
  ,CurrentOfficeAddress02:'00N0I00000KoFnm' // 現勤務先－住所２（市区郡名）
  ,CurrentOfficeAddress03:'00N0I00000KoFnr' // 現勤務先－住所３（町村名）
  ,CurrentOfficeAddress04:'00N0I00000KoFnw' // 現勤務先－住所４（番地名）
  ,CurrentOfficeAddress05:'00N0I00000KoFo1' // 現勤務先－住所５（建物名・その他）
  ,InfoProvisionToKouyu:'00N0I00000KoFoV' // 校友会への情報提供
  ,SendingProduct:'00N0I00000KoFoa' // 送付物
  ,DestinationHopeName:'00NF800000Ab8GQ' // 送付希望先
};

// 非公開項目
const hiddenFieldList = {
  oid:'00D5D000000A8yu'  // 開発
  ,company:'近畿大学校友会'
};

/* フォームの初期化 */
window.onpageshow = function() {
  form.reset();
}

/* ゼロ埋め num:値,len:桁数 */
function zeroPadding(num,len) {
  var regex = new RegExp(/[1-9]/);
  if(num && regex.test(num)) {
    return (Array(len).join('0') + num).slice(-len);
  } else {
    return num;
  }
}

/* 全角英数字記号⇒半角英数字記号に変換 */
function toHanKaku(str) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９－＋＃＊]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
}

var HKlist = new Array('ｧ','ｨ','ｩ','ｪ','ｫ','ｬ','ｭ','ｮ','ｯ','ｰ','ｳﾞ','ｶﾞ','ｷﾞ','ｸﾞ','ｹﾞ','ｺﾞ','ｻﾞ','ｼﾞ','ｽﾞ','ｾﾞ','ｿﾞ','ﾀﾞ','ﾁﾞ','ﾂﾞ','ﾃﾞ','ﾄﾞ','ﾊﾞ','ﾋﾞ','ﾌﾞ','ﾍﾞ','ﾎﾞ','ﾊﾟ','ﾋﾟ','ﾌﾟ','ﾍﾟ','ﾎﾟ','ｱ','ｲ','ｳ','ｴ','ｵ','ｶ','ｷ','ｸ','ｹ','ｺ','ｻ','ｼ','ｽ','ｾ','ｿ','ﾀ','ﾁ','ﾂ','ﾃ','ﾄ','ﾅ','ﾆ','ﾇ','ﾈ','ﾉ','ﾊ','ﾋ','ﾌ','ﾍ','ﾎ','ﾏ','ﾐ','ﾑ','ﾒ','ﾓ','ﾔ','ﾕ','ﾖ','ﾗ','ﾘ','ﾙ','ﾚ','ﾛ','ﾜ','ｦ','ﾝ');
var ZKlist = new Array('ァ','ィ','ゥ','ェ','ォ','ャ','ュ','ョ','ッ','ー','ヴ','ガ','ギ','グ','ゲ','ゴ','ザ','ジ','ズ','ゼ','ゾ','ダ','ヂ','ヅ','デ','ド','バ','ビ','ブ','ベ','ボ','パ','ピ','プ','ペ','ポ','ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン');

/* 半角カナ⇒全角カナに変換 */
function HKtoZK(str) {
  var retValue = str;
  for(var i = 0; i < HKlist.length; i++) {
    retValue = retValue.replace(new RegExp(HKlist[i], 'g'), ZKlist[i]);
  }
  return retValue;
}

/* 全角カナ⇒半角カナに変換 */
function ZKtoHK(str) {
  var retValue = str;
  for(var i = 0; i < ZKlist.length; i++) {
    retValue = retValue.replace(new RegExp(ZKlist[i], 'g'), HKlist[i]);
  }
  return retValue;
}

/* 住所変換 */
function convAddress(str) {
  return HKtoZK(toHanKaku(str).replace(/[－－‐]/,'-'));
}

(function(){
  
  /* 物故：表示切り替え */
  document.getElementById('ChangeContent').addEventListener('change', function(event) {
    var nonBukkoList = document.getElementsByClassName('non-bukko');
    for(var i = 0; i < nonBukkoList.length; i++) {
      if(document.getElementById('ChangeContent').value == '物故') {
        nonBukkoList[i].classList.remove('show');
      } else {
        nonBukkoList[i].classList.add('show');
      }
    }
  })

  /* 送付物：表示切り替え */
  document.getElementById('SendingProduct').addEventListener('change', function(event) {
    var nonSendList = document.getElementsByClassName('non-send');
    for(var i = 0; i < nonSendList.length; i++) {
      if(document.getElementById('SendingProduct').value == '送付物不要') {
        nonSendList[i].classList.remove('show');
      } else {
        nonSendList[i].classList.add('show');
      }
    }
  })

  /* 送信前処理 */
  document.getElementById('inputCheckButton').addEventListener('click', function(event) {
    
    // 非表示項目に値を設定
    setHiddenField();
    
    // 物故の非表示入力項目をクリア
    if(document.getElementById('ChangeContent').value == '物故') {
      var nonBukkoInputList = Array.from(document.querySelectorAll('.non-bukko > div > input'));
      for(var i in nonBukkoInputList) {
        nonBukkoInputList[i].value = '';
      }
    }

    // 送付先不要の非表示入力項目をクリア
    if(document.getElementById('SendingProduct').value == '送付物不要') {
      var nonSendInputList = Array.from(document.querySelectorAll('.non-send > div  > input'));
      for(var i in nonSendInputList) {
        nonSendInputList[i].value = '';
      }
    }

    if(formValidError()) {
      form.querySelector(':invalid').focus();
    } else {

      // 確認画面の値設定
      document.querySelectorAll('.form-control,.form-select').forEach(
        function(element) {
          var getItem = document.getElementById('Output' + element.id);
          console.log(getItem);
          if(getItem) {
            getItem.innerHTML = element.value;
          }
        }
      );

      outputAddress('OutputAddress');
      
      outputAddress('OutputWoAddress');
      window.scrollTo({top:0,left:0,behavior:'instant'});
      document.getElementById('inputView').classList.remove('show');
      document.getElementById('verificationView').classList.add('show');
    }

    // バリデーション実行済みにする
    form.classList.add('was-validated');
    
    // バリデーション後に値が変更されたら再チェック
    Array.prototype.slice.call(form.querySelectorAll('input')).forEach(function(element) {
        element.addEventListener('change', function() {
          formValidError();
        })
      }
    );
  }, false)

  /* 送信処理 */
  document.getElementById('submitButton').addEventListener('click', function(event) {

    if(!formValidError()) {
      
      // 物故の非表示選択項目をクリア
      if(document.getElementById('ChangeContent').value == '物故') {
        var nonBukkoSelectList = Array.from(document.querySelectorAll('.non-bukko > div > select'));
        for(var i in nonBukkoSelectList) {
          nonBukkoSelectList[i].value = '';
        }
      }

      // 送付先不要の非表示選択項目をクリア
      if(document.getElementById('SendingProduct').value == '送付物不要') {
        var nonSendSelectList = Array.from(document.querySelectorAll('.non-send > div > select'));
        for(var i in nonSendSelectList) {
          nonSendSelectList[i].value = '';
        }
      }
      
      // 非公開項目を追加
      for(var key in hiddenFieldList) {
        createInputHidden(key, hiddenFieldList[key]);
      }

      // 戻りURLを指定
      createInputHidden('retURL', location.href.replace(/[^/]*$/, 'SendResult.html'));

      // 非表示項目に値を設定
      setHiddenField();

      // nameを設定
      for(var key in fieldList) {
        document.getElementById(key).name = fieldList[key]; 
      }

      document.getElementById('form').submit();
    }
  }, false)
})()

/* バリデーションエラー後処理 */
function formValidError() {
  // カナチェック
  var lKana = document.getElementById('last_name_kana');
  var fKana = document.getElementById('first_name_kana');
  var max = document.getElementById('Name_Kana').maxLength;
  lKana.setCustomValidity('');
  fKana.setCustomValidity('');
  if(lKana.value.length + fKana.value.length + 1 > max) {
    lKana.setCustomValidity('セイ、メイの合計文字数が' + max + 'を超えています');
    fKana.setCustomValidity('セイ、メイの合計文字数が' + max + 'を超えています');
  }

  // 電話番号チェック
  var phone = document.getElementById('phone');
  if(!document.getElementById('phone').checkValidity()) {
    document.getElementById('phone_1').setCustomValidity(phone.validationMessage);
    document.getElementById('phone_2').setCustomValidity(phone.validationMessage);
    document.getElementById('phone_3').setCustomValidity(phone.validationMessage);
  } else {
    document.getElementById('phone_1').setCustomValidity('')
    document.getElementById('phone_2').setCustomValidity('')
    document.getElementById('phone_3').setCustomValidity('')
  }

  // 携帯電話番号チェック
  var mobile = document.getElementById('mobile');
  if(!document.getElementById('mobile').checkValidity()) {
    document.getElementById('mobile_1').setCustomValidity(mobile.validationMessage);
    document.getElementById('mobile_2').setCustomValidity(mobile.validationMessage);
    document.getElementById('mobile_3').setCustomValidity(mobile.validationMessage);
  } else {
    document.getElementById('mobile_1').setCustomValidity('')
    document.getElementById('mobile_2').setCustomValidity('')
    document.getElementById('mobile_3').setCustomValidity('')
  }

  // 郵便番号チェック
  zipErrorCheck('zip_1', 'zip_2');
  zipErrorCheck('CurrentOfficePostalCode_1', 'CurrentOfficePostalCode_2');
  
  // バリデーションのエラーメッセージを挿入
  if(!form.checkValidity()) {
    var invalids = form.querySelectorAll(':invalid');
    if (0 < invalids.length) {
      for (var i = 0; i < invalids.length; i++) {
        var invalid = invalids[i];
        var errorMessage = invalid.parentNode.querySelector('.invalid-feedback');
        if(errorMessage !== null) {
          errorMessage.innerHTML = errorMessage.title + invalid.validationMessage;
        }
      }
    }
    return true;
  }
  return false;
}

/* 郵便番号エラーチェック */
function zipErrorCheck(element1, element2) {
  var yubinerrorMessage = '郵便番号に空欄があります。';
  var yubin1 = document.getElementById(element1);
  var yubin2 = document.getElementById(element2);
  console.log(yubin1+','+yubin2);
  yubin1.setCustomValidity('');
  yubin2.setCustomValidity('');
  if(yubin1.value && !yubin2.value) {
    yubin2.setCustomValidity(yubinerrorMessage);
  } else if(!yubin1.value && yubin2.value) {
    yubin1.setCustomValidity(yubinerrorMessage);
  }
}

/* 入力欄作成 inputName:名,inputValue:値 */
function createInputHidden(inputName,inputValue){
  var temp_input = document.createElement('input');
  temp_input.id= inputName;
  temp_input.value = inputValue;
  temp_input.name = inputName;
  temp_input.type = 'hidden';
  form.appendChild(temp_input);
}

// 非表示項目設定
function setHiddenField() {
  //校友番号設定
  var alumnusNums = [
    document.getElementById('AlumnusNumber_1').value
    ,document.getElementById('AlumnusNumber_2').value
    ,document.getElementById('AlumnusNumber_3').value
    ,document.getElementById('AlumnusNumber_4').value
    ,document.getElementById('AlumnusNumber_5').value
  ];
  document.getElementById('AlumnusNumber').value = alumnusNums.join('-');

  //卒年
  document.getElementById('GraduationYears').value
    = document.getElementById('input_graduation_gengou').value
    + document.getElementById('input_graduation_year').value
    + '年';

  //生年月日
  document.getElementById('Birthday').value
    = document.getElementById('birthday_1').value
    + '-'
    + zeroPadding(document.getElementById('birthday_2').value, 2)
    + '-'
    + zeroPadding(document.getElementById('birthday_3').value, 2);

  //フリガナ
  document.getElementById('Name_Kana').value
    = document.getElementById('last_name_kana').value
    + ' '
    + document.getElementById('first_name_kana').value;
  
  // 現住所郵便番
  var zip1 = document.getElementById('zip_1').value;
  var zip2 = document.getElementById('zip_2').value;
  if(zip1.trim() && zip2.trim()) {
    document.getElementById('zip').value = zip1 + '-' + zip2;
  }

  // 勤務先郵便番号
  var CurrentOfficePostalCode1 = document.getElementById('CurrentOfficePostalCode_1').value;
  var CurrentOfficePostalCode2 = document.getElementById('CurrentOfficePostalCode_2').value;
  if(CurrentOfficePostalCode1.trim() && CurrentOfficePostalCode2.trim()) {
    document.getElementById('CurrentOfficePostalCode').value
      = CurrentOfficePostalCode1
      + '-'
      + CurrentOfficePostalCode2;
  }
}

/* 確認画面住所表示 */
function outputAddress(parentElement) {
  var parent = document.getElementById(parentElement);
  parent.classList.remove('show');
  var children = parent.querySelectorAll('span');
  console.log(document.getElementById(parentElement));
  console.log(document.getElementById(parentElement).querySelectorAll('span'));
  for(var i in children) {
    if(children[i].innerHTML) {
      parent.classList.add('show');
      break;
    }
  }
}