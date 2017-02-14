<?php
    if (!defined('DOKU_INC')) die();

?>
<div class="tab-container">
    <ul class="meta-tabs">

        <li><a href="#spr__tab-toc" aria-expanded="false"><span class="prefix"><?php echo $lang['toc']?></span></a></li>
        <li><a href="#spr__tab-tags" aria-expanded="false"><span class="prefix">Tags <span class="num">0</span></span></a></li>
        <li><a href="#spr__tab-jira" aria-expanded="false"><span class="prefix">Jira <span class="num">0</span></span></a></li>

    </ul>

    <div class="meta-content">
        <div class="box-content">
            <div id="spr__tab-toc" class="tab-pane" aria-hidden="true">
                <?php  tpl_toc(); ?>
            </div>

                <div id="spr__tab-tags" class="tab-pane" aria-hidden="true">
                    <div>
                    <?php
                        if ($tags !== null) {
                            $tags->tpl_tags();
                        }else{
                            echo "<p>" . tpl_getLang('meta_box_tags_none') . "</p>";
                        }
                    ?>
                    </div>
                </div>

            <div id="spr__tab-jira" class="tab-pane" aria-hidden="true">
                <div>
                <p><?php echo tpl_getLang('meta_box_jira_tickets_none') ?></p>
                </div>
            </div>
        </div>
    </div>
</div>
