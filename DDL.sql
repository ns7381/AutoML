cf_LogisticRegression_labelCol/*
Navicat MySQL Data Transfer

Source Server         : 10.110.17.12
Source Server Version : 50505
Source Host           : 10.110.17.12:3307
Source Database       : insight_ml

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2018-09-29 13:43:08
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for model
-- ----------------------------
DROP TABLE IF EXISTS `model`;
CREATE TABLE `model` (
  `id` varchar(36) NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL,
  `method` varchar(64) DEFAULT NULL,
  `module` varchar(64) DEFAULT NULL,
  `model_path` varchar(255) DEFAULT NULL,
  `status` varchar(11) NOT NULL DEFAULT '0',
  `create_time` datetime DEFAULT NULL,
  `project_id` varchar(36) DEFAULT NULL,
  `user_id` varchar(36) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of model
-- ----------------------------

-- ----------------------------
-- Table structure for node
-- ----------------------------
DROP TABLE IF EXISTS `node`;
CREATE TABLE `node` (
  `id` varchar(36) NOT NULL,
  `name` varchar(36) DEFAULT NULL,
  `module` varchar(36) DEFAULT NULL,
  `method` varchar(36) DEFAULT NULL,
  `order_num` int(11) DEFAULT NULL,
  `is_leaf` int(11) DEFAULT NULL,
  `parent_id` varchar(36) DEFAULT NULL,
  `input` varchar(36) DEFAULT NULL,
  `output` varchar(36) DEFAULT NULL,
  `icon` varchar(36) DEFAULT NULL,
  `is_hide` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of node
-- ----------------------------
INSERT INTO `node` VALUES ('datasource', '数据源', '', 'read', '1', '0', 'root', '', 'df', 'fa-folder', '0');
INSERT INTO `node` VALUES ('feature_transformers_VectorAssembler', '特征向量合并', 'pyspark.ml.feature', 'VectorAssembler', '11', '1', 'feature_transformers', 'df', 'df', 'fa-exchange', '0');
INSERT INTO `node` VALUES ('ml_reg_RandomForestRegressor', '随机森林', 'pyspark.ml.regression', 'RandomForestRegressor', '1', '1', 'ml_regression', 'df', 'model', 'fa-dot-circle-o', '0');
INSERT INTO `node` VALUES ('st_write_file', '写文件', 'app.ml.source_target', 'FileWrite', '1', '1', 'st', 'df', '', 'fa-file', '0');
INSERT INTO `node` VALUES ('feature_extractors_IDF', '逆向文件频率', 'pyspark.ml.feature', 'IDF', '2', '1', 'feature_extractors', 'df', 'df', 'fa-circle', '0');
INSERT INTO `node` VALUES ('feature_transformers_Binarizer', '二值化', 'pyspark.ml.feature', 'Binarizer', '4', '1', 'feature_transformers', 'df', 'df', 'fa-exchange', '0');
INSERT INTO `node` VALUES ('ml_clustering_LDA', 'LDA', 'pyspark.ml.clustering', 'LDA', '4', '1', 'ml_clustering', 'df', 'model', 'fa-cubes', '0');
INSERT INTO `node` VALUES ('statistic', '统计分析', '', 'read', '6', '0', 'root', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('ml_recommendation', '协同推荐', '', 'read', '3', '0', 'ml', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('feature_selectors', '特征选择', '', 'read', '3', '0', 'feature', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('ml_cf_LinearSVC', 'LinearSVC', 'pyspark.ml.classification', 'LinearSVC', '8', '1', 'ml_classification', 'df', 'model', 'fa-list-ul', '0');
INSERT INTO `node` VALUES ('ml_reg_AFTSurvivalRegression', '生存回归', 'pyspark.ml.regression', 'AFTSurvivalRegression', '6', '1', 'ml_regression', 'df', 'model', 'fa-dot-circle-o', '0');
INSERT INTO `node` VALUES ('ml_clustering_GaussianMixture', '高斯混合', 'pyspark.ml.clustering', 'GaussianMixture', '3', '1', 'ml_clustering', 'df', 'model', 'fa-cubes', '0');
INSERT INTO `node` VALUES ('ml_cf_RandomForestClassifier', '随机森林', 'pyspark.ml.classification', 'RandomForestClassifier', '3', '1', 'ml_classification', 'df', 'model', 'fa-list-ul', '0');
INSERT INTO `node` VALUES ('ml_clustering_KMeans', 'K均值', 'pyspark.ml.clustering', 'KMeans', '1', '1', 'ml_clustering', 'df', 'model', 'fa-cubes', '0');
INSERT INTO `node` VALUES ('pre', '数据预处理', '', 'read', '4', '0', 'root', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('feature_transformers_OneHotEncoder', '独热编码', 'pyspark.ml.feature', 'OneHotEncoder', '9', '1', 'feature_transformers', 'df', 'df', 'fa-exchange', '0');
INSERT INTO `node` VALUES ('ml_evaluate_biclassification', '二分类评估', 'app.ml.evaluation', 'ClassificationEvaluator', '1', '1', 'ml_evaluate', 'df', '', 'fa-paper-plane', '0');
INSERT INTO `node` VALUES ('ml_cf_NaiveBayes', '朴素贝叶斯', 'pyspark.ml.classification', 'NaiveBayes', '1', '1', 'ml_classification', 'df', 'model', 'fa-list-ul', '0');
INSERT INTO `node` VALUES ('ml_clustering_BisectingKMeans', '二分K均值', 'pyspark.ml.clustering', 'BisectingKMeans', '2', '1', 'ml_clustering', 'df', 'model', 'fa-cubes', '0');
INSERT INTO `node` VALUES ('st_save_module', '保存模型', 'app.ml.source_target', 'ModelSave', '5', '1', 'st', 'model', '', 'fa-file-archive-o', '0');
INSERT INTO `node` VALUES ('feature_selectors_VectorSlicer', '向量机', 'pyspark.ml.feature', 'VectorSlicer', '1', '1', 'feature_selectors', 'df', 'df', 'fa-square', '0');
INSERT INTO `node` VALUES ('st', '源/目标', '', 'read', '3', '0', 'root', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('feature_transformers_Tokenizer', '分词器', 'pyspark.ml.feature', 'Tokenizer', '1', '1', 'feature_transformers', 'df', 'df', 'fa-exchange', '0');
INSERT INTO `node` VALUES ('st_read_db', '读数据表', 'app.ml.source_target', 'JDBCRead', '4', '1', 'st', '', 'df', 'fa-database', '0');
INSERT INTO `node` VALUES ('feature', '特征工程', '', 'read', '5', '0', 'root', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('feature_transformers', '特征转换', '', 'read', '2', '0', 'feature', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('ml_reg_GeneralizedLinearRegression', '广义线性回归', 'pyspark.ml.regression', 'GeneralizedLinearRegression', '7', '1', 'ml_regression', 'df', 'model', 'fa-dot-circle-o', '0');
INSERT INTO `node` VALUES ('model', '已保存模型', '', 'read', '2', '0', 'root', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('ml_cf_LogisticRegression', '逻辑回归', 'pyspark.ml.classification', 'LogisticRegression', '4', '1', 'ml_classification', 'df', 'model', 'fa-list-ul', '0');
INSERT INTO `node` VALUES ('ml_evaluate_clustering', '聚类评估', 'app.ml.evaluation', 'ClusterEvaluator', '4', '1', 'ml_evaluate', 'model,df', '', 'fa-paper-plane', '0');
INSERT INTO `node` VALUES ('feature_transformers_PCA', '主元分析', 'pyspark.ml.feature', 'PCA', '5', '1', 'feature_transformers', 'df', 'df', 'fa-exchange', '0');
INSERT INTO `node` VALUES ('feature_transformers_NGram', 'N元模型', 'pyspark.ml.feature', 'NGram', '3', '1', 'feature_transformers', 'df', 'df', 'fa-exchange', '0');
INSERT INTO `node` VALUES ('feature_extractors_HashingTF', '词频', 'pyspark.ml.feature', 'HashingTF', '1', '1', 'feature_extractors', 'df', 'df', 'fa-circle', '0');
INSERT INTO `node` VALUES ('st_read_file', '读文件', 'app.ml.source_target', 'FileRead', '3', '1', 'st', '', 'df', 'fa-file-o', '0');
INSERT INTO `node` VALUES ('feature_extractors', '特征提取', '', 'read', '1', '0', 'feature', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('feature_transformers_SWR', '去停用词', 'pyspark.ml.feature', 'StopWordsRemover', '2', '1', 'feature_transformers', 'df', 'df', 'fa-exchange', '0');
INSERT INTO `node` VALUES ('feature_transformers_IndexToString', '索引-字符串变换', 'app.ml.feature', 'IndexToString', '8', '1', 'feature_transformers', 'df', 'df', 'fa-exchange', '0');
INSERT INTO `node` VALUES ('feature_extractors_Word2Vec', 'Word2Vec', 'pyspark.ml.feature', 'Word2Vec', '3', '1', 'feature_extractors', 'df', 'df', 'fa-circle', '0');
INSERT INTO `node` VALUES ('ml_reg_DecisionTreeRegressor', '决策树回归', 'pyspark.ml.regression', 'DecisionTreeRegressor', '3', '1', 'ml_regression', 'df', 'model', 'fa-dot-circle-o', '0');
INSERT INTO `node` VALUES ('pre_type_converter', '类型转换', 'app.ml.preprocessing', 'TypeConverter', '2', '1', 'pre', 'df', 'df', 'fa-columns', '0');
INSERT INTO `node` VALUES ('feature_transformers_VectorIndexer', '向量类型索引化', 'pyspark.ml.feature', 'VectorIndexer', '10', '1', 'feature_transformers', 'df', 'df', 'fa-exchange', '0');
INSERT INTO `node` VALUES ('ml_evaluate_regression', '回归评估', 'app.ml.evaluation', 'RegressionEvaluator', '3', '1', 'ml_evaluate', 'df', '', 'fa-paper-plane', '0');
INSERT INTO `node` VALUES ('statistic_bar', '直方图', 'app.ml.statistic', 'Histogram', '1', '1', 'statistic', 'df', '', 'fa-bar-chart', '0');
INSERT INTO `node` VALUES ('feature_transformers_PE', '多项式扩展', 'pyspark.ml.feature', 'PolynomialExpansion', '6', '1', 'feature_transformers', 'df', 'df', 'fa-exchange', '0');
INSERT INTO `node` VALUES ('ml_cf_GBTClassifier', 'GBT(梯度提升树)', 'pyspark.ml.classification', 'GBTClassifier', '6', '1', 'ml_classification', 'df', 'model', 'fa-list-ul', '0');
INSERT INTO `node` VALUES ('ml_predict', '预测', 'app.ml.predict', 'Predict', '6', '1', 'ml', 'model,df', 'df', 'fa-neuter', '0');
INSERT INTO `node` VALUES ('ml_evaluate', '评估', '', 'read', '5', '0', 'ml', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('ml_reg_GBTRegressor', 'GBT(梯度提升树)', 'pyspark.ml.regression', 'GBTRegressor', '4', '1', 'ml_regression', 'df', 'model', 'fa-dot-circle-o', '0');
INSERT INTO `node` VALUES ('ml', '机器学习', '', 'read', '7', '0', 'root', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('pre_split', '拆分', 'app.ml.preprocessing', 'Splitter', '1', '1', 'pre', 'df', 'df,df', 'fa-columns', '0');
INSERT INTO `node` VALUES ('ml_cf_MultilayerPerceptronClassifier', '多层感知器', 'pyspark.ml.classification', 'MultilayerPerceptronClassifier', '5', '1', 'ml_classification', 'df', 'model', 'fa-list-ul', '0');
INSERT INTO `node` VALUES ('feature_transformers_StringIndexer', '字符串-索引变换', 'pyspark.ml.feature', 'StringIndexer', '7', '1', 'feature_transformers', 'df', 'df', 'fa-exchange', '0');
INSERT INTO `node` VALUES ('ml_cf_OneVsRest', 'OneVsRest', 'pyspark.ml.classification', 'OneVsRest', '7', '1', 'ml_classification', 'df', 'model', 'fa-list-ul', '0');
INSERT INTO `node` VALUES ('ml_regression', '回归分析', '', 'read', '2', '0', 'ml', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('st_write_db', '写数据表', 'app.ml.source_target', 'JDBCWrite', '2', '1', 'st', 'df', '', 'fa-database', '0');
INSERT INTO `node` VALUES ('ml_classification', '多元分类', '', 'read', '1', '0', 'ml', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('ml_evaluate_classification', '多分类评估', 'app.ml.evaluation', 'ClassificationEvaluator', '2', '1', 'ml_evaluate', 'df', '', 'fa-paper-plane', '0');
INSERT INTO `node` VALUES ('ml_clustering', '聚类分析', '', 'read', '4', '0', 'ml', '', '', 'fa-folder', '0');
INSERT INTO `node` VALUES ('ml_reg_LinearRegression', '线性回归', 'pyspark.ml.regression', 'LinearRegression', '2', '1', 'ml_regression', 'df', 'model', 'fa-dot-circle-o', '0');
INSERT INTO `node` VALUES ('ml_cf_DecisionTreeClassifier', '决策树', 'pyspark.ml.classification', 'DecisionTreeClassifier', '2', '1', 'ml_classification', 'df', 'model', 'fa-list-ul', '0');
INSERT INTO `node` VALUES ('ml_reg_IsotonicRegression', '保序回归', 'pyspark.ml.regression', 'IsotonicRegression', '5', '1', 'ml_regression', 'df', 'model', 'fa-dot-circle-o', '0');
INSERT INTO `node` VALUES ('feature_extractors_CountVectorizer', '计数向量器', 'pyspark.ml.feature', 'CountVectorizer', '4', '1', 'feature_extractors', 'df', 'df', 'fa-circle', '0');
INSERT INTO `node` VALUES ('ml_recommendation_ALS', '协同过滤', 'pyspark.ml.recommendation', 'ALS', '1', '1', 'ml_recommendation', 'df', 'model', 'fa-life-ring', '0');

-- ----------------------------
-- Table structure for node_param
-- ----------------------------
DROP TABLE IF EXISTS `node_param`;
CREATE TABLE `node_param` (
  `id` varchar(36) NOT NULL,
  `name` varchar(36) DEFAULT NULL,
  `label` varchar(36) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` varchar(11) DEFAULT NULL,
  `default_value` varchar(36) DEFAULT NULL,
  `order_num` int(11) DEFAULT NULL,
  `node_id` varchar(36) DEFAULT NULL,
  `is_required` int(11) DEFAULT NULL,
  `validation` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of node_param
-- ----------------------------
INSERT INTO `node_param` VALUES ('extractors_CV_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_extractors_CountVectorizer', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('extractors_IDF_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_extractors_IDF', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_PE_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_transformers_PE', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('extractors_HashTF_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_extractors_HashingTF', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_IndexToString_origin', 'origin', '原始字段', '索引的原始字符串字段', 'field', '', '2', 'feature_transformers_IndexToString', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_DecisionTreeReg_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_reg_DecisionTreeRegressor', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('extractors_IDF_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_extractors_IDF', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_write_file_file_path', 'file_path', '文件名称', '', 'string', '', '2', 'st_write_file', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('extractors_CountVectorizer_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_extractors_CountVectorizer', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_NaiveBayes_predictionCol', 'predictionCol', '预测结果列名', '', 'string', '', '3', 'ml_cf_NaiveBayes', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_IndexToString_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_transformers_IndexToString', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('selectors_VectorSlicer_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_selectors_VectorSlicer', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_OneVsRest_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_cf_OneVsRest', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_PCA_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_transformers_PCA', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_DTC_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_cf_DecisionTreeClassifier', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_LinearSVC_predictionCol', 'predictionCol', '预测结果列名', '', 'string', '', '3', 'ml_cf_LinearSVC', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_VectorIndexer_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_transformers_VectorIndexer', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_Binarizer_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_transformers_Binarizer', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('KMeans_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_clustering_KMeans', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('pre_type_converter_int', 'int_columns', '转换为int类型的列', '', 'fields', '', '2', 'pre_type_converter', '1', null);
INSERT INTO `node_param` VALUES ('GaussianMixture_featuresCol', 'featuresCol', '特征列', '', 'field', '', '3', 'ml_clustering_GaussianMixture', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_OneHotEncoder_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_transformers_OneHotEncoder', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_GBTRegressor_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_reg_GBTRegressor', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('extractors_Word2Vec_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_extractors_Word2Vec', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_NaiveBayes_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_cf_NaiveBayes', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('classification_predictionCol', 'predictionCol', '预测结果列名', '', 'field', '', '1', 'ml_evaluate_classification', '1', null);
INSERT INTO `node_param` VALUES ('pre_type_converter_double', 'double_columns', '转换为double类型的列', '', 'fields', '', '1', 'pre_type_converter', '1', null);
INSERT INTO `node_param` VALUES ('reg_AFTSurvivalReg_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_reg_AFTSurvivalRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_SWR_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_transformers_SWR', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_VectorIndexer_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_transformers_VectorIndexer', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_MPC_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_cf_MultilayerPerceptronClassifier', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_SWR_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_transformers_SWR', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('extractors_HashTF_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_extractors_HashingTF', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_StringIndexer_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_transformers_StringIndexer', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_save_module_name', 'name', '名称', '', 'string', '', '1', 'st_save_module', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_NGram_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_transformers_NGram', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_RandomForestReg_predictionCol', 'predictionCol', '预测结果列', '', 'string', '', '3', 'ml_reg_RandomForestRegressor', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('biclassification_labelCol', 'labelCol', '原始标签列名', '', 'field', '', '2', 'ml_evaluate_biclassification', '1', null);
INSERT INTO `node_param` VALUES ('cf_OneVsRest_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_cf_OneVsRest', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_DTC_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_cf_DecisionTreeClassifier', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_RandomForestReg_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_reg_RandomForestRegressor', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_LinearRegression_predictionCol', 'predictionCol', '预测结果列', '', 'string', '', '3', 'ml_reg_LinearRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_GeneralizedLinearReg_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_reg_GeneralizedLinearRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_LinearRegression_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_reg_LinearRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_IsotonicRegression_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_reg_IsotonicRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('ml_recommendation_ALS_itemCol', 'itemCol', '项目列', '', 'field', '', '2', 'ml_recommendation_ALS', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_StringIndexer_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_transformers_StringIndexer', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_GBTClassifier_predictionCol', 'predictionCol', '预测结果列名', '', 'string', '', '3', 'ml_cf_GBTClassifier', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('BisectingKMeans_predictionCol', 'predictionCol', '预测结果列', '', 'field', '', '2', 'ml_clustering_BisectingKMeans', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_IsotonicRegression_predictionCol', 'predictionCol', '预测结果列', '', 'string', '', '3', 'ml_reg_IsotonicRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_write_file_delimiter', 'delimiter', '字段分隔符', '', 'string', ',', '1', 'st_write_file', '0', '');
INSERT INTO `node_param` VALUES ('reg_RandomForestReg_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_reg_RandomForestRegressor', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('GaussianMixture_predictionCol', 'predictionCol', '预测结果列', '', 'field', '', '3', 'ml_clustering_GaussianMixture', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_OneVsRest_predictionCol', 'predictionCol', '预测结果列名', '', 'string', '', '3', 'ml_cf_OneVsRest', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_VectorAssembler_inputCol', 'inputCols', '输入字段', '', 'fields', '', '1', 'feature_transformers_VectorAssembler', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_LogisticRegression_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_cf_LogisticRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_OneHotEncoder_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_transformers_OneHotEncoder', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_GBTClassifier_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_cf_GBTClassifier', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_PCA_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_transformers_PCA', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('KMeans_predictionCol', 'predictionCol', '预测结果列', '', 'field', '', '1', 'ml_clustering_KMeans', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_IsotonicRegression_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_reg_IsotonicRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_NGram_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_transformers_NGram', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('selectors_VectorSlicer_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_selectors_VectorSlicer', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_GBTRegressor_predictionCol', 'predictionCol', '预测结果列', '', 'string', '', '3', 'ml_reg_GBTRegressor', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('BisectingKMeans_featuresCol', 'featuresCol', '特征列', '', 'field', '', '2', 'ml_clustering_BisectingKMeans', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_RFC_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_cf_RandomForestClassifier', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_Tokenizer_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_transformers_Tokenizer', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_NaiveBayes_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_cf_NaiveBayes', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_MPC_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_cf_MultilayerPerceptronClassifier', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_DecisionTreeReg_predictionCol', 'predictionCol', '预测结果列', '', 'string', '', '3', 'ml_reg_DecisionTreeRegressor', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('regression_labelCol', 'labelCol', '原始标签列名', '', 'field', '', '2', 'ml_evaluate_regression', '1', null);
INSERT INTO `node_param` VALUES ('pre_split_rating', 'rating', '拆分比例', null, 'float', null, '1', 'pre_split', '1', '{\"required\":true,\"zero_one\":true}');
INSERT INTO `node_param` VALUES ('trans_VectorAssembler_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_transformers_VectorAssembler', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_LogisticRegression_predictionCol', 'predictionCol', '预测结果列名', '', 'string', '', '3', 'ml_cf_LogisticRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_Binarizer_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_transformers_Binarizer', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_IndexToString_outputCol', 'outputCol', '输出字段', '', 'string', '', '3', 'feature_transformers_IndexToString', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('biclassification_predictionCol', 'predictionCol', '预测结果列名', '', 'field', '', '1', 'ml_evaluate_biclassification', '1', null);
INSERT INTO `node_param` VALUES ('cf_LinearSVC_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_cf_LinearSVC', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('ml_recommendation_ALS_userCol', 'userCol', '用户列', '', 'field', '', '1', 'ml_recommendation_ALS', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_GBTClassifier_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_cf_GBTClassifier', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_DecisionTreeReg_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_reg_DecisionTreeRegressor', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_LinearRegression_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_reg_LinearRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('regression_predictionCol', 'predictionCol', '预测结果列名', '', 'field', '', '1', 'ml_evaluate_regression', '1', null);
INSERT INTO `node_param` VALUES ('reg_GeneralizedLinearReg_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_reg_GeneralizedLinearRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_RFC_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_cf_RandomForestClassifier', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_save_module_file_path', 'file_path', '文件目录', '', 'string', '', '2', 'st_save_module', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_write_file_columns', 'columns', '输出列', '', 'fields', '', '3', 'st_write_file', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('pre_type_converter_string', 'string_columns', '转换为string类型的列', '', 'fields', '', '3', 'pre_type_converter', '1', null);
INSERT INTO `node_param` VALUES ('classification_labelCol', 'labelCol', '原始标签列名', '', 'field', '', '2', 'ml_evaluate_classification', '1', null);
INSERT INTO `node_param` VALUES ('cf_LinearSVC_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_cf_LinearSVC', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_GeneralizedLinearReg_predictionC', 'predictionCol', '预测结果列', '', 'string', '', '3', 'ml_reg_GeneralizedLinearRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_LogisticRegression_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_cf_LogisticRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('ml_recommendation_ALS_ratingCol', 'ratingCol', '比率列', '', 'field', '', '3', 'ml_recommendation_ALS', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_MPC_predictionCol', 'predictionCol', '预测结果列名', '', 'string', '', '3', 'ml_cf_MultilayerPerceptronClassifier', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_RFC_predictionCol', 'predictionCol', '预测结果列名', '', 'string', '', '3', 'ml_cf_RandomForestClassifier', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_PE_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_transformers_PE', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_AFTSurvivalReg_predictionCol', 'predictionCol', '预测结果列', '', 'string', '', '3', 'ml_reg_AFTSurvivalRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('extractors_Word2Vec_outputCol', 'outputCol', '输出字段', '', 'string', '', '2', 'feature_extractors_Word2Vec', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('trans_Tokenizer_inputCol', 'inputCol', '输入字段', '', 'field', '', '1', 'feature_transformers_Tokenizer', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_DTC_predictionCol', 'predictionCol', '预测结果列名', '', 'string', '', '3', 'ml_cf_DecisionTreeClassifier', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_GBTRegressor_featuresCol', 'featuresCol', '特征列', '', 'field', '', '1', 'ml_reg_GBTRegressor', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('LDA_featuresCol', 'featuresCol', '特征列', '', 'field', '', '4', 'ml_clustering_LDA', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('reg_AFTSurvivalReg_labelCol', 'labelCol', '标签列', '', 'field', '', '2', 'ml_reg_AFTSurvivalRegression', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('cf_LogisticRegression_maxIter', 'maxIter', '最大迭代次数', '', 'int', '100', '4', 'ml_cf_LogisticRegression', '1', '{\"required\":true, \"positive_integer_not_zero\":true}');
INSERT INTO `node_param` VALUES ('cf_LogisticRegression_regParam', 'regParam', '正则项系数', '', 'float', '0.0', '5', 'ml_cf_LogisticRegression', '1', '{\"required\":true, \"positive_float\":true}');
INSERT INTO `node_param` VALUES ('st_read_file_format', 'format', '文件格式', '', 'list', '', '1', 'st_read_file', '1', '{\"inList\": [\"csv\",\"text\",\"json\"]}');
INSERT INTO `node_param` VALUES ('st_read_file_file_path', 'file_path', '文件路径', '', 'string', '', '2', 'st_read_file', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_read_file_delimiter', 'delimiter', '分隔符', '', 'string', ',', '3', 'st_read_file', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_read_file_header', 'header', '第一行是标题', '', 'bool', '', '4', 'st_read_file', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_read_db_db_host', 'db_host', '数据库地址', '', 'string', '', '1', 'st_read_db', '1', '{\"required\":true,\"IP\":true}');
INSERT INTO `node_param` VALUES ('st_read_db_db_port', 'db_port', '数据库端口', '', 'int', '', '2', 'st_read_db', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_read_db_db_database', 'db_database', '数据库', '', 'string', '', '3', 'st_read_db', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_read_db_dbtable', 'dbtable', '数据库表名称', '', 'string', '', '4', 'st_read_db', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_read_db_user', 'user', '用户名', '', 'string', '', '5', 'st_read_db', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_read_db_password', 'password', '密码', '', 'string', '', '6', 'st_read_db', '1', '');
INSERT INTO `node_param` VALUES ('st_write_db_db_host', 'db_host', '数据库地址', '', 'string', '', '1', 'st_write_db', '1', '{\"required\":true,\"IP\":true}');
INSERT INTO `node_param` VALUES ('st_write_db_db_port', 'db_port', '数据库端口', '', 'int', '', '2', 'st_write_db', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_write_db_db_database', 'db_database', '数据库', ',', 'string', '', '3', 'st_write_db', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_write_db_dbtable', 'dbtable', '数据库表名称', '', 'string', '', '4', 'st_write_db', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_write_db_user', 'user', '用户名', '', 'string', '', '5', 'st_write_db', '1', '{\"required\":true}');
INSERT INTO `node_param` VALUES ('st_write_db_password', 'password', '密码', '', 'string', '', '6', 'st_write_db', '1', '{\"required\":true}');

-- ----------------------------
-- Table structure for operation_audit
-- ----------------------------
DROP TABLE IF EXISTS `operation_audit`;
CREATE TABLE `operation_audit` (
  `id` varchar(36) NOT NULL COMMENT 'ä¸»é”®',
  `uid` varchar(36) NOT NULL COMMENT 'ç”¨æˆ·id',
  `login_name` varchar(50) NOT NULL COMMENT 'ç™»é™†è´¦å·',
  `ctime` datetime NOT NULL COMMENT 'è®°å½•æ—¶é—´',
  `result` varchar(150) NOT NULL COMMENT 'ç»“æžœ',
  `remote_ip` varchar(50) NOT NULL COMMENT 'è¿œç¨‹IPåœ°å€',
  `remote_addr` varchar(50) NOT NULL COMMENT 'è¿œç¨‹åœ°åŸŸåœ°å€ï¼ˆå¦‚æµŽå—ã€é’å²›ï¼‰',
  `server_ip` varchar(50) NOT NULL COMMENT 'å½“å‰æœåŠ¡å™¨IPåœ°å€',
  `server_name` varchar(100) NOT NULL COMMENT 'å½“å‰æœåŠ¡å™¨åç§°',
  `request_url` varchar(255) DEFAULT NULL,
  `request_method` varchar(10) DEFAULT NULL,
  `request_body` varchar(10000) DEFAULT NULL,
  `query_string` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` varchar(36) NOT NULL DEFAULT '0',
  `name` varchar(64) NOT NULL,
  `memory` int(11) NOT NULL DEFAULT '0',
  `cores` int(11) NOT NULL DEFAULT '0',
  `create_time` datetime DEFAULT NULL,
  `user_id` varchar(36) NOT NULL DEFAULT '0',
  `status` varchar(36) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for project_edge
-- ----------------------------
DROP TABLE IF EXISTS `project_edge`;
CREATE TABLE `project_edge` (
  `id` varchar(36) NOT NULL,
  `project_id` varchar(36) DEFAULT NULL,
  `connections` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for project_node
-- ----------------------------
DROP TABLE IF EXISTS `project_node`;
CREATE TABLE `project_node` (
  `id` varchar(36) NOT NULL,
  `name` varchar(36) DEFAULT NULL,
  `module` varchar(36) DEFAULT NULL,
  `method` varchar(36) DEFAULT NULL,
  `order_num` int(11) DEFAULT NULL,
  `input` varchar(36) DEFAULT NULL,
  `output` varchar(36) DEFAULT NULL,
  `icon` varchar(36) DEFAULT NULL,
  `columns` varchar(10240) DEFAULT NULL,
  `params` varchar(255) DEFAULT NULL,
  `position_x` bigint(11) DEFAULT NULL,
  `position_y` bigint(11) DEFAULT NULL,
  `log` text,
  `result` text,
  `status` varchar(36) DEFAULT NULL,
  `node_definition_id` varchar(36) DEFAULT NULL,
  `project_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('admin', 'admin', null);

-- ----------------------------
-- Table structure for roles_users
-- ----------------------------
DROP TABLE IF EXISTS `roles_users`;
CREATE TABLE `roles_users` (
  `user_id` varchar(36) NOT NULL,
  `role_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of roles_users
-- ----------------------------
INSERT INTO `roles_users` VALUES ('admin', 'admin');

-- ----------------------------
-- Table structure for source
-- ----------------------------
DROP TABLE IF EXISTS `source`;
CREATE TABLE `source` (
  `id` varchar(36) NOT NULL DEFAULT '0' COMMENT 'ID',
  `name` varchar(36) DEFAULT NULL COMMENT 'æ•°æ®æºåç§°',
  `file_path` varchar(255) DEFAULT NULL COMMENT 'æ•°æ®æºç±»åž‹',
  `format` varchar(36) DEFAULT NULL,
  `options` varchar(255) DEFAULT NULL COMMENT 'å¤‡ç”¨å­—æ®µ',
  `user_id` varchar(36) DEFAULT NULL COMMENT 'ç”¨æˆ·åID',
  `create_time` datetime DEFAULT NULL COMMENT 'åˆ›å»ºæ—¶é—´',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` varchar(36) NOT NULL DEFAULT '0',
  `user_name` varchar(64) NOT NULL,
  `password` varchar(64) DEFAULT NULL,
  `active` int(11) NOT NULL DEFAULT '0',
  `note` varchar(256) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `reserve` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('admin', 'admin', '$2b$12$E0wY1dtPqmgeEzf/7K0mxu3d6VvL5VRLbl3bh7QP9DGcMwucZZ9OC', '1', null, '2017-01-12 16:47:33', null);
