/**
 * 系统中的所有状态
 *
 * Created by jinzk on 2015/12/28.
 */
define(['jquery'], function($) {

    var handlerCore = function(status, label, cssClass, ext) {
        status = status || 'unknown';
        label = label || "未知";
        cssClass = cssClass || "label-status";
        if (typeof ext !== "undefined") {
            label = label + ' ( '+ext+' )';
        }
        return {status: status, label: label, cssClass: $.isArray(cssClass) ? cssClass.join(" ") : cssClass};
    };

    var statusHandler = {
        'default': function(status, ext) {
            return handlerCore(status, status, ["label-status"], ext);
        },
        // 结果状态，如success、fail、failed、error、failure
        'result': function(status, ext) {
            var label, cssClass = ["label-status"];
            switch (status) {
                case 'SUCCESS':
                    label = "已成功";
                    cssClass.push("label-status-success");
                    break;
                case 'ERROR':
                case 'FAIL':
                case 'FAILED':
                case 'FAILURE':
                    label = "已失败";
                    cssClass.push("label-status-danger");
                    break;
                case 'WARNING':
                    label = status;
                    cssClass.push("label-status-warning");
                    break;
                default:
                    label = status;
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        // 可用状态，如 enable 和 active、 disable 和 unactive
        'able': function(status, ext) {
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'ENABLE':
                    label = "可用";
                    break;
                case 'DISABLE':
                    label = "不可用";
                    break;
                case 'ACTIVE':
                    label = "已启用";
                    break;
                case 'ADMIN':
                    label = "管理员";
                    break;
                case 'UNACTIVE':
                    label = "已停用";
                    break;
                default:
                    label = status;
                    break;
            }
            // css class
            switch (status) {
                case 'ENABLE':
                case 'ACTIVE':
                case 'ADMIN':
                    cssClass.push("label-status-success");
                    break;
                case 'DISABLE':
                case 'UNACTIVE':
                    cssClass.push("label-status-danger");
                    break;
                case 'WARNING':
                    cssClass.push("label-status-warning");
                    break;
                default:
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        // 云主机
        'vm': function(status, ext) {
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'ACTIVE':
                case 'RUNNING':
                    label = "运行中";
                    break;
                case 'BUILD':
                case 'BUILDING':
                    label = "创建中";
                    break;
                case 'REBUILD':
                case 'REBUILDING':
                    label = "重建中";
                    break;
                case 'SUSPENDED':
                    label = "已挂起";
                    break;
                case 'SUSPENDING':
                    label = "挂起中";
                    break;
                case 'PAUSED':
                    label = "已暂停";
                    break;
                case 'PAUSING':
                    label = "暂停中";
                    break;
                case 'RESIZE':
                case 'RESIZING':
                    label = "重建中";
                    break;
                case 'MIGRATING':
                    label = "迁移中";
                    break;
                case 'VERIFY_RESIZE':
                    label = "确认重建";
                    break;
                case 'REVERT_RESIZE':
                    label = "回退重建";
                    break;
                case 'REBOOT':
                case 'REBOOTING':
                    label = "重启中";
                    break;
                case 'HARD_REBOOT':
                case 'HARD_REBOOTING':
                    label = "硬重启中";
                    break;
                case 'SOFT_DELETED':
                case 'DELETED':
                    label = "已删除";
                    break;
                case 'DELETING':
                    label = "删除中";
                    break;
                case 'SHUTOFF':
                case 'STOPPED':
                    label = "已关机";
                    break;
                case 'SHUTOFFING':
                case 'STOPPING':
                    label = "关机中";
                    break;
                case 'ERROR':
                    label = "错误";
                    break;
                case 'UNRECOGNIZED':
                    label = "未知";
                    break;
                default:
                    label = status;
                    break;
            }
            // css class
            switch (status) {
                case 'ACTIVE':
                case 'RUNNING':
                case 'VERIFY_RESIZE':
                    cssClass.push("label-status-success");
                    break;
                case 'BUILD':
                case 'BUILDING':
                case 'REBUILD':
                case 'REBUILDING':
                case 'SUSPENDING':
                case 'PAUSING':
                case 'RESIZE':
                case 'RESIZING':
                case 'MIGRATING':
                case 'REBOOT':
                case 'REBOOTING':
                case 'HARD_REBOOT':
                case 'HARD_REBOOTING':
                case 'DELETING':
                case 'SHUTOFFING':
                case 'STOPPING':
                    cssClass.push("label-status-info");
                    cssClass.push("anim-breath");
                    break;
                case 'SUSPENDED':
                case 'PAUSED':
                case 'REVERT_RESIZE':
                    cssClass.push("label-status-warning");
                    break;
                case 'DELETED':
                case 'SHUTOFF':
                case 'STOPPED':
                case 'FAILED':
                case 'UNACTIVE':
                case 'ERROR':
                case 'UNRECOGNIZED':
                    cssClass.push("label-status-danger");
                    break;
                default:
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        // 物理主机
        'phost': function(status, ext) {
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'AVAILABLE':
                    label = "可用";
                    break;
                case 'UNAVAILABLE':
                    label = "不可用";
                    break;
                default:
                    label = status;
                    break;
            }
            // css class
            switch (status) {
                case 'AVAILABLE':
                    cssClass.push("label-status-success");
                    break;
                case 'UNAVAILABLE':
                    cssClass.push("label-status-danger");
                    break;
                default:
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        // 磁盘
        'block': function(status, ext) {
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'AVAILABLE':
                    label = "可用";
                    break;
                case 'ATTACHING':
                    label = "挂载中";
                    break;
                case 'BACKING_UP':
                    label = "备份";
                    break;
                case 'CREATING':
                    label = "创建中";
                    break;
                case 'DELETING':
                    label = "删除中";
                    break;
                case 'DOWNLOADING':
                    label = "下载中";
                    break;
                case 'UPLOADING':
                    label = "上传中";
                    break;
                case 'ERROR':
                    label = "错误";
                    break;
                case 'ERROR_DELETING':
                    label = "删除错误";
                    break;
                case 'DELETED':
                    label = "已删除";
                    break;
                case 'ERROR_RESTORING':
                    label = "恢复错误";
                    break;
                case 'IN_USE':
                    label = "使用中";
                    break;
                case 'RESTORING_BACKUP':
                    label = "恢复中";
                    break;
                case 'UNRECOGNIZED':
                    label = "未知";
                    break;
                default:
                    label = status;
                    break;
            }
            // css class
            switch (status) {
                case 'AVAILABLE':
                    cssClass.push("label-status-success");
                    break;
                case 'ATTACHING':
                case 'CREATING':
                case 'DELETING':
                case 'DOWNLOADING':
                case 'UPLOADING':
                case 'RESTORING_BACKUP':
                    cssClass.push("anim-breath");
                case 'IN_USE':
                    cssClass.push("label-status-info");
                    break;
                case 'BACKING_UP':
                    cssClass.push("label-status-warning");
                    break;
                case 'ERROR':
                case 'ERROR_DELETING':
                case 'DELETED':
                    cssClass.push("label-status-danger");
                    break;
                default:
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        // 磁盘
        'storage': function(status, ext) {
            var label, cssClass = ["label-status"];
         // label
            switch (status) {
                case 'AVAILABLE':
                    label = "可用";
                    break;
                case 'UNAVAILABLE':
                    label = "不可用";
                    break;
                default:
                    label = status;
                    break;
            }
            // css class
            switch (status) {
                case 'AVAILABLE':
                    cssClass.push("label-status-success");
                    break;
                case 'UNAVAILABLE':
                    cssClass.push("label-status-danger");
                    break;
                default:
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        // 镜像
        'image': function(status, ext) {
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'ACTIVE':
                    label = "可用";
                    break;
                case 'ISSUING':
                    label = "发布中";
                    break;
                case 'SAVING':
                    label = "保存中";
                    break;
                case 'QUEUED':
                    label = "等待上传";
                    break;
                case 'DOWNLOADING':
                    label = "下载中";
                    break;
                case 'DELETED':
                    label = "已删除";
                    break;
                case 'KILLED':
                    label = "错误";
                    break;
                case 'UPLOADING':
                    label = "上传中";
                    break;
                default:
                    label = status;
                    break;
            }
            // css class
            switch (status) {
                case 'ACTIVE':
                    cssClass.push("label-status-success");
                    break;
                case 'ISSUING':
                case 'SAVING':
                case 'DOWNLOADING':
                    cssClass.push("anim-breath");
                case 'QUEUED':
                    cssClass.push("label-status-info");
                    break;
                case 'KILLED':
                case 'DELETED':
                    cssClass.push("label-status-danger");
                    break;
                default:
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        //服务定义
        'service': function(status, ext) {
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'PUBLISH':
                    label = "已发布";
                    break;
                case 'EDIT':
                    label = "未发布";
                    break;
            }
            // css class
            switch (status) {
                case 'PUBLISH':
                    cssClass.push("label-status-success");
                    break;
                case 'EDIT':
                    cssClass.push("label-status-muted");
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        //服务实例，应用环境
        'cluster': function(status, ext) {
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'RUNNING':
                    label = "运行中";
                    break;
                case 'STOPPED':
                    label = "停止";
                    break;
                case 'OFFLINE':
                    label = "离线";
                    break;
                case 'UNAVAILABLE':
                    label = "不可用";
                    break;
                case 'DELETED':
                    label = "已删除";
                    break;
                case 'ERROR':
                    label = "错误";
                    break;
                case 'OUTER':
                    label = "外部服务";
                    break;
                default:
                    label = "未知";
                    break;
            }
            // css class
            switch (status) {
                case 'RUNNING':
                case 'OUTER':
                    cssClass.push("label-status-success");
                    break;
                case 'STOPPED':
                    cssClass.push("label-status-info");
                    break;
                case 'OFFLINE':
                case 'ERROR':
                case 'DELETED':
                case 'UNAVAILABLE':
                    cssClass.push("label-status-danger");
                    break;
                default:
                    cssClass.push("label-status-danger");
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        //服务请求，request
        'request': function(status, ext) {
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'PREPAIR':
                    label = "准备";
                    break;
                case 'PROCESSING':
                    label = "处理中";
                    break;
                case 'ERROR':
                    label = "错误";
                    break;
                case 'TIMEOUT':
                    label = "超时";
                    break;
                case 'FINISHED':
                    label = "结束";
                    break;
                default:
                    label = "未知";
                    break;
            }
            // css class
            switch (status) {
                case 'FINISHED':
                    cssClass.push("label-status-success");
                    break;
                case 'PROCESSING':
                    cssClass.push("label-status-info");
                    cssClass.push("anim-breath");
                    break;
                case 'PREPAIR':
                    cssClass.push("label-status-info");
                    break;
                case 'TIMEOUT':
                case 'ERROR':
                    cssClass.push("label-status-danger");
                    break;
                default:
                    cssClass.push("label-status-danger");
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        //服务命令，command
        'command': function(status, ext) {
        	var label, cssClass = ["label-status"];
            // label
            switch (status) {
	            case 'PREPAIR':
	                label = "准备";
	                break;
	            case 'START':
	                label = "开始";
	                break;
	            case 'TIMEOUT':
	                label = "超时";
	                break;
	            case 'SUCCESS':
	                label = "成功";
	                break;
	            case 'FAILURE':
	                label = "失败";
	                break;
	            case 'SKIP':
	                label = "跳过";
	                break;
	            default:
	                label = "未知";
	                break;
            }
            // css class
            switch (status) {
                case 'SUCCESS':
                case 'SKIP':
                    cssClass.push("label-status-success");
                    break;
                case 'PREPAIR':
                    cssClass.push("label-status-info");
                    break;
                case 'START':
                    cssClass.push("label-status-info");
                    cssClass.push("anim-breath");
                    break;
                case 'TIMEOUT':
                case 'FAILURE':
                    cssClass.push("label-status-danger");
                    break;
                default:
                    cssClass.push("label-status-danger");
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        //Agent
        'agent': function(status, ext) {
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'RUNNING':
                    label = "运行中";
                    break;
                case 'UPDATING':
                    label = "更新中";
                    break;
                case 'STOPPED':
                    label = "已停止";
                    break;
                default:
                    label = "未知";
                    break;
            }
            // css class
            switch (status) {
                case 'RUNNING':
                    cssClass.push("label-status-success");
                    break;
                case 'UPDATING':
                    cssClass.push("label-status-info");
                    break;
                case 'STOPPED':

                default:
                	cssClass.push("label-status-danger");
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        // 告警级别
        'instance': function (status, ext) {
            var label, cssClass = ["label-status", "label-status-alarm-instance"];
            // label
            switch (status) {
                case 'CRITICAL':
                    label = "紧急";
                    break;
                case 'MODERATE':
                    label = "重要";
                    break;
                case 'LOW':
                    label = "一般";
                    break;
                default:
                    label = status;
                    break;
            }
            // css class
            switch (status) {
                case 'CRITICAL':
                    cssClass.push("label-status-danger");
                    break;
                case 'MODERATE':
                    cssClass.push("label-status-warning");
                    break;
                case 'LOW':
                    cssClass.push("label-status-info");
                    break;
                default:
                    label = status;
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        //弹性伸缩组云主机
        'scalingserver': function(status, ext) {
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'INSERVICE':
                    label = "运行中";
                    break;
                case 'PENDING':
                    label = "创建中";
                    break;
                case 'PENDING_WAIT':
                    label = "创建等待中";
                    break;
                case 'REMOVING':
                    label = "移出中";
                    break;
                case 'REMOVING_WAIT':
                    label = "移出等待中";
                    break;
                case 'CREATE_ERROR':
                    label = "错误";
                    break;                    
                default:
                    label = "未知";
                    break;
            }
            // css class
            switch (status) {
                case 'INSERVICE':
                    cssClass.push("label-status-success");
                    break;
                case 'PENDING':
                case 'REMOVING':
                    cssClass.push("anim-breath");
                case 'PENDING_WAIT':
                case 'REMOVING_WAIT':
                    cssClass.push("label-status-info");
                    break;
                default:
                	cssClass.push("label-status-danger");
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        // 告警级别
        'alarm': function(status, ext) {
            var label, cssClass = ["label-status", "label-status-alarm"];
            // label
            switch (status) {
                case 'CRITICAL':
                    label = "紧急";
                    break;
                case 'MODERATE':
                    label = "重要";
                    break;
                case 'LOW':
                    label = "一般";
                    break;
                case 'OK':
                    label = "正常";
                    break;
                case 'ALARM':
                    label = "告警";
                    break;
                case 'INSUFFICIENTDATA':
                    label = "无监控数据";
                    break;
                default:
                    label = status;
                    break;
            }
            // css class
            switch (status) {
                case 'CRITICAL':
                    cssClass.push("label-status-danger");
                    break;
                case 'MODERATE':
                    cssClass.push("label-status-warning");
                    break;
                case 'LOW':
                    cssClass.push("label-status-info");
                    break;
                case 'OK':
                    cssClass.push("label-status-success");
                    break;
                case 'ALARM':
                    cssClass.push("label-status-danger");
                    break;
                case 'INSUFFICIENTDATA':
                    cssClass.push("label-status-danger");
                    break;
                default:
                    label = status;
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        // 地址池
        "ipool": function(status, ext) {
            var label, cssClass = ["label-status"];
            switch (status) {
                case 'LOCKED':
                    label = "已锁定";
                    cssClass.push("label-status-danger");
                    break;
                case 'ALLOCATED':
                    label = "已分配";
                    cssClass.push("label-status-success");
                    break;
                case 'UNALLOCATED':
                    label = "未分配";
                    break;
                default:
                    label = status;
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        // 用户
        "user": function(status, ext) {
            var label, cssClass = ["label-status"];
            switch (status) {
                case 'NORMAL':
                    label = "正常";
                    cssClass.push("label-status-success");
                    break;
                case 'LOCKED':
                    label = "已锁定";
                    cssClass.push("label-status-warning");
                    break;
                case 'DELETE':
                    label = "已删除";
                    cssClass.push("label-status-danger");
                    break;
                case 'RESET_PWD':
                    label = "密码重置";
                    cssClass.push("label-status-warning");
                    break;
                case 'DISABLED':
                    label = "已禁用";
                    break;
                default:
                    label = status;
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        // collection状态
        'collection': function(status, ext) {
            //var label, cssClass = ["label-status", "label-status-alarm"];
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'CRITICAL':
                    label = "不可用";
                    break;
                case 'MODERATE':
                    label = "异常";
                    break;
                case 'OK':
                    label = "可用";
                    break;
                default:
                    label = status;
                    break;
            }
         // css class
            switch (status) {
                case 'CRITICAL':
                    cssClass.push("label-status-danger");
                    break;
                case 'MODERATE':
                    cssClass.push("label-status-warning");
                    break;
                case 'OK':
                    cssClass.push("label-status-success");
                    break;
                default:
                    label = status;
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
        //服务申请
        'service_apply': function(status, ext) {
            //var label, cssClass = ["label-status", "label-status-alarm"];
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'SUBMIT':
                    label = "待审核";
                    break;
                case 'PROCESSING':
                    label = "部署中";
                    break;
                case 'FINISH':
                    label = "已部署";
                    break;
                case 'RELEASE':
                    label = "已释放";
                    break;                                            
                case 'REJECT':
                    label = "已驳回";
                    break;
                case 'INSTALL_FAILED':
                    label = "部署失败";
                    break;                    
                    
                default:
                    label = status;
                    break;
            }
         // css class
            switch (status) {
                case 'SUBMIT':
                    cssClass.push("label-status-danger");
                    break;
                case 'PROCESSING':
                    cssClass.push("label-status-warning");
                    break;
                case 'FINISH':
                    cssClass.push("label-status-success");
                    break;
                case 'RELEASE':
                    cssClass.push("label-status-success");
                    break;                    
                case 'REJECT':
                	 cssClass.push("label-status-warning");
                    break; 
                case 'INSTALL_FAILED':
                    cssClass.push("label-status-danger");
                    break;                   
                default:
                    label = status;
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
      //工单处理
        'service_worker': function(status, ext) {
            //var label, cssClass = ["label-status", "label-status-alarm"];
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'SUBMIT':
                    label = "待处理";
                    break;
                case 'SAVE':
                    label = "未提交";
                    break;
                case 'FINISH':
                    label = "已办结";
                    break;
                                   
                default:
                    label = status;
                    break;
            }
         // css class
            switch (status) {
                case 'SAVE':
                    cssClass.push("label-status-danger");
                    break;
                case 'SUBMIT':
                    cssClass.push("label-status-warning");
                    break;
                case 'FINISH':
                    cssClass.push("label-status-success");
                    break;            
                default:
                    label = status;
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        },
      //运行状态
        'service_process': function(status, ext) {
            //var label, cssClass = ["label-status", "label-status-alarm"];
            var label, cssClass = ["label-status"];
            // label
            switch (status) {
                case 'NORMAL':
                    label = "正常";
                    break;
                case 'ABNORMAL':
                    label = "异常"; 
                    break;
                default:
                    label = status;
                    break;
            }
         // css class
            switch (status) {
                case 'ABNORMAL':
                    cssClass.push("label-status-danger");
                    break;
                case 'NORMAL':
                    cssClass.push("label-status-success");
                    break;            
                default:
                    label = status;
                    break;
            }
            return handlerCore(status, label, cssClass, ext);
        }
        
    };

  
    

    
    
    var parseStatus = function(status) {
        var statusGroup = (status && typeof status === "string") ? status : "unknown";
        statusGroup = statusGroup.split(':');
        if (statusGroup.length > 1) {
            status = statusGroup[1].toUpperCase();
        } else {
            status = statusGroup[0].toUpperCase();
        }
        status = status.replace(/\-/g, "_");
        var handlerKey, ext;
        if (statusGroup.length == 2) {
            handlerKey = statusGroup[0].toLowerCase();
            if (typeof statusHandler[handlerKey] !== "function") {
                ext = statusGroup[1];
                handlerKey = "default";
            }
        } else if (statusGroup.length > 2) {
            handlerKey = statusGroup[0].toLowerCase();
            ext = statusGroup[2];
        }
        if (typeof statusHandler[handlerKey] !== "function") {
            handlerKey = "default";
        }
        return statusHandler[handlerKey].call(statusHandler[handlerKey], status, ext);
    };

    var statusLabel = function(status, label) {
        var statusObj = parseStatus(status);
        return '<label class="'+statusObj.cssClass+'" data-status="'+statusObj.status+'">'+(typeof label !== "undefined" && label != null ? label : statusObj.label)+'</label>';
    };

    var statusLabelTitle = function(status, label) {
        var statusObj = parseStatus(status);
        return '<label class="'+statusObj.cssClass+' label-status-icon" title="'+(typeof label !== "undefined" && label != null ? label : statusObj.label)+'" data-toggle="tooltip" data-status="'+statusObj.status+'"></label>';
    };

    return {
        compile: statusLabel,
        compile2Title: statusLabelTitle
    };

});
