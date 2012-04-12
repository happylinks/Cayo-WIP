<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
  <title><?php echo $title_for_layout?></title>
  <?php
  echo $this->Html->charset();
  echo $this->Html->css('bootstrap');
  echo $this->Html->css('datatables');
  echo $this->Html->css('jquery.noty');
  echo $this->Html->css('noty_theme_twitter');
  echo $this->Html->meta('icon');
  echo $this->Html->script('libs/jquery');
  echo $this->Html->script('libs/jquery.tmpl.min');
  echo $this->Html->script('libs/bootstrap-alert');
  echo $this->Html->script('libs/bootstrap-button');
  echo $this->Html->script('libs/bootstrap-collapse');
  echo $this->Html->script('libs/bootstrap-dropdown');
  echo $this->Html->script('libs/bootstrap-modal');
  echo $this->Html->script('libs/bootstrap-tab');
  echo $this->Html->script('libs/bootstrap-tooltip');
  echo $this->Html->script('libs/bootstrap-popover');
  echo $this->Html->script('libs/bootstrap-typeahead');
  echo $this->Html->script('libs/bootbox.min');
  echo $this->Html->script('libs/jquery.datatables');
  echo $this->Html->script('libs/datatables.custom');
  echo $this->Html->script('libs/jquery.noty');
  echo $this->Html->script('default');
  echo $this->Html->script('model');
  echo $scripts_for_layout;
  ?>
  <style type="text/css">
  body {
    padding-top: 60px;
    padding-bottom: 40px;
  }
  </style>
</head>

<body>
	<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
      <div class="container-fluid">
        <a data-target=".nav-collapse" data-toggle="collapse" class="btn btn-navbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </a>
        <a href="#" class="brand">Cayo</a>
        <div class="nav-collapse">
          <ul class="nav">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <p class="navbar-text pull-right">Logged in as <a href="#">username</a></p>
        </div><!--/.nav-collapse -->
      </div>
    </div>
  </div>  
  <div class="container-fluid">
    <div class="row-fluid">
      <div class="span2">
        <div style="padding: 8px 0;" class="well sidebar-nav">
          <ul class="nav nav-list cayosidenav">
            <li class="nav-header">Pages</li>
            <li><a href="#">Home</a></li>
            <li class="nav-header">Models</li>
            <?php
            $controllers = Configure::read('controllerlist');
            foreach($controllers as $controllername){
              if($controllername != ''){
                $controllername = str_replace('Controller','',$controllername);
                ?>
                <li class="model" name='<?php echo $controllername; ?>'><a href="<?php echo $this->Html->url('/').$controllername; ?>/index"><?php echo $controllername; ?></a></li>
                <?php
              }
            }
            ?>

            <li class="divider"></li>
            <li><a href="#">Help</a></li>
          </ul>
        </div><!--/.well-->
      </div><!--/.span-->
      <div id="messagearea"></div>
      <?php echo $this->fetch('content'); ?>
    </div>
    <hr>
    <footer>
      <p>&copy; Notillia 2012</p>
    </footer>
  </div>
</body>
</html>
