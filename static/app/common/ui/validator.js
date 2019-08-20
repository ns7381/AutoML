/**
 * 表单校验组件
 *
 * Created by jinzk on 2015/12/3.
 */
define(['jquery', 'jq/form/validator-bs3'], function($) {
    // init form validator rules
    if($.validator) {
        $.validator.addMethod('positive_integer', function(value, element) {
            return this.optional(element) || /^[0-9]+$/.test(value);
        }, "只能输入正整数数值");
        $.validator.addMethod('positive_integer_not_zero', function(value, element) {
            return this.optional(element) || /^[1-9]+[0-9]*]*$/.test(value);
        }, "只能输入大于0的正整数数值");
        $.validator.addMethod('positive_float', function(value, element) {
            return this.optional(element) || /^\d+(\.\d+)?$/.test(value);
        }, "只能输入大于0的float数值");
        $.validator.addMethod('integer', function(value, element) {
            return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?$/.test(value);
        }, "只能输入整数数值");
        $.validator.addMethod('mobile', function(value, element) {
            return this.optional(element) || /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0-9]|170)\d{8}$/.test(value);
        }, "请输入正确的手机号");
        $.validator.addMethod('telephone', function(value, element) {
            return this.optional(element) || /^\d{3,4}-?\d{7,9}$/.test(value);
        }, "请输入正确的电话号码");
        $.validator.addMethod('var', function(value, element) {
            return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
        }, "请输入正确的名称,仅包含字母和数字");
        $.validator.addMethod('name_db', function(value, element) {
            return this.optional(element) || /^[a-z][a-z0-9_\.]*$/i.test(value);
        }, "请输入正确的名称,只能以字母开头,仅包含字母、数字、点和下划线");
        $.validator.addMethod('name_db_pg', function(value, element) {
            return this.optional(element) || /^(?!pg_)[a-z][a-z0-9_\.]*$/i.test(value);
        }, "请输入正确的名称,只能以字母开头但不能以pg_开头,仅包含字母、数字、点和下划线");
        $.validator.addMethod('name_en', function(value, element) {
            return this.optional(element) || /^[a-z][a-z0-9_\-\.]*$/i.test(value);
        }, "请输入正确的名称,只能以字母开头,仅包含字母、数字、点、下划线及中横线");
        $.validator.addMethod('name_directory', function(value, element) {
            return this.optional(element) || /^[\/][a-z][a-z0-9_\-\.\/]*$/i.test(value);
        }, "请输入正确的名称,只能以斜线开头,仅包含字母、数字、点、下划线、中横线及斜线");
        $.validator.addMethod('name_cn', function(value, element) {
            return this.optional(element) || /^[a-z\u4E00-\u9FA5][a-z0-9_\u4E00-\u9FA5\-\.\s()（）]*$/i.test(value);
        }, "请输入正确的名称,只能以字母或汉字开头,仅包含字母、汉字、数字、点、空格、括号、下划线及中横线");
        $.validator.addMethod('IP', function(value, element) {
            return this.optional(element) || /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value);
        }, "请输入正确的IP(v4)地址");
        $.validator.addMethod('IPV6', function(value, element) {
            return this.optional(element) || (value.match(/:/g).length<=7 && /::/.test(value) ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(value) : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(value));
        }, "请输入正确的IPv6地址");
        $.validator.addMethod("version", function(value, element) {
            return this.optional(element) || /^[vV]?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(\.(0|[1-9][0-9]*)(\-([a-zA-Z0-9\.])+)*)*(\.(0|[1-9][0-9]*)(\-([a-zA-Z0-9\.])+)*(\+([a-zA-Z0-9\.])+)*)*$/.test(value);
        }, "请输入正确的版本号（可以v或者V或者数字开头，字母、数字、点号、中短线、加号组成,例：v1.0,v1.0.0,1.0.0-alpha,1.0.0-alpha+001）");
        $.validator.addMethod("notEqualTo", function(value, element, param) {
        	return value !== $(param).val();
        }, $.validator.format("不能与指定域的值相同"));
        $.validator.addMethod("notEqualToOldPwd", function(value, element, param) {
        	return value !== $(param).val();
        }, $.validator.format("不能与原密码相同"));
        $.validator.addMethod("zero_one", function(value, element, param) {
        	return 0 < value && value < 1;
        }, $.validator.format("请输入0到1之间的数"));
        $.validator.addMethod('inList', function(value, element, param) {
            return $.isArray(param) && $.inArray(value, param) > -1;
        }, function (args) {
            return "请输入列表[" + args + "]中的值!";
        });
    }
});