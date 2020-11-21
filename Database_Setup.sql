-- Create table "SHOPPINGLIST" to hold shopping list object
CREATE TABLE shoppinglist (items CLOB);

-- Create REST endpoints
BEGIN
  -- Enable schema for REST calls
  ORDS.ENABLE_SCHEMA(
      p_enabled             => TRUE,
      p_schema              => 'ADMIN',
      p_url_mapping_type    => 'BASE_PATH',
      p_url_mapping_pattern => 'shoppinglist',
      p_auto_rest_auth      => FALSE);

  -- Create new REST module "Shopping List persistence"
  ORDS.DEFINE_MODULE(
      p_module_name    => 'Shopping List persistence',
      p_base_path      => '/storage/',
      p_items_per_page => 25,
      p_status         => 'PUBLISHED',
      p_comments       => NULL);

  -- Create new template
  ORDS.DEFINE_TEMPLATE(
      p_module_name    => 'Shopping List persistence',
      p_pattern        => 'items',
      p_priority       => 0,
      p_etag_type      => 'HASH',
      p_etag_query     => NULL,
      p_comments       => NULL);

  -- Define POST REST handler to store JSON object
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'Shopping List persistence',
      p_pattern        => 'items',
      p_method         => 'POST',
      p_source_type    => 'plsql/block',
      p_items_per_page => 25,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
         'DECLARE
            v_rows     PLS_INTEGER;
            v_payload  CLOB := :body_text;
         BEGIN
            SELECT COUNT(1) INTO v_rows FROM shoppinglist;
            IF v_rows = 0 THEN
               INSERT INTO shoppinglist (items) VALUES (v_payload);
            ELSE
               UPDATE shoppinglist SET items = v_payload;
            END IF;
         END;'
  );

  -- Define GET handler to retrieve JSON object
  ORDS.DEFINE_HANDLER(
      p_module_name    => 'Shopping List persistence',
      p_pattern        => 'items',
      p_method         => 'GET',
      p_source_type    => 'json/collection',
      p_items_per_page => 25,
      p_mimes_allowed  => '',
      p_comments       => NULL,
      p_source         => 
         'SELECT items FROM shoppinglist'
  );

  COMMIT;
END;
