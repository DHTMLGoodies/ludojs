<?php
/**
 * Created by IntelliJ IDEA.
 * User: alfmagne1
 * Date: 23/09/16
 * Time: 16:57
 */
date_default_timezone_set("Europe/Berlin");
$rnd = date("YmdHis");

?>
<script type="text/javascript" src="<?php echo $prefix; ?>../mootools/MooTools-Core-1.6.0.js"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../mootools/MooTools-More-1.6.0.js"></script>


<script type="text/javascript" src="<?php echo $prefix; ?>../src/ludo.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/util.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/registry.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/object-factory.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/config.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/dom.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/core.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/view.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/util/geometry.js?rnd=<?php echo $rnd; ?>"></script>


<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/animation.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/engine.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/view.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/event-manager.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/node.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/named-node.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/canvas.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/filter.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/gradient.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/mask.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/polyline.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/polygon.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/paint.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/stop.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/rect.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/circle.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/path.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/group.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/text-box.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/effect.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/text.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/matrix.js?rnd=<?php echo $rnd; ?>"></script>



<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/base.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/grid.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/card.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-horizontal.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/linear-vertical.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/relative.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/resizer.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/renderer.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/nav-bar.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/fill.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/factory.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/popup.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/canvas.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/tab.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/tabs.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/text-box.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu-vertical.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/menu-container.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/collapse-bar.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/table.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/layout/accordion.js?rnd=<?php echo $rnd; ?>"></script>





<script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/effect.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/drag.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/drag-drop.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/effect/resize.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/effect.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/svg/drag.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/tpl/parser.js?rnd=<?php echo $rnd; ?>"></script>


<script type="text/javascript" src="<?php echo $prefix; ?>../src/view/shim.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/framed-view.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/window.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/video/video.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/video/you-tube.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/view/title-bar.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/view/button-bar.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/view/view-pager-nav.js?rnd=<?php echo $rnd; ?>"></script>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/manager.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/element.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/label.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/label-element.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/button.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/text.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/textarea.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/number.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/spinner.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/filter-text.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/email.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/password.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/checkbox.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/select.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/submit-button.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/cancel-button.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/slider.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/toggle-group.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/reset-button.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/combo.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/date.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/color.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/file.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/display-field.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/radio-group.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/on-off.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/seekbar.js?rnd=<?php echo $rnd; ?>"></script>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/remote/base.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/remote/json.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/remote/broadcaster.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/remote/shim.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/remote/inject.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/remote/html.js?rnd=<?php echo $rnd; ?>"></script>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/validator/base.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/validator/fns.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/form/validator/md5.js?rnd=<?php echo $rnd; ?>"></script>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/base.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/json.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/collection.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/collection-search.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/search-parser.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/html.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/record.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/tree-collection.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/data-source/tree-collection-search.js?rnd=<?php echo $rnd; ?>"></script>


<script type="text/javascript" src="<?php echo $prefix; ?>../src/progress/base.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/progress/bar.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/progress/datasource.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/progress/text.js?rnd=<?php echo $rnd; ?>"></script>


<script type="text/javascript" src="<?php echo $prefix; ?>../src/card/button.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/card/finish-button.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/card/next-button.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/card/previous-button.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/card/progress-bar.js?rnd=<?php echo $rnd; ?>"></script>


<script type="text/javascript" src="<?php echo $prefix; ?>../src/notification.js?rnd=<?php echo $rnd; ?>"></script>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/time-picker.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/base.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/calendar.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/selector.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/year-selector.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/month-year-selector.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/month-selector.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/days.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/nav-bar.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/calendar/today.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/language/default.js?rnd=<?php echo $rnd; ?>"></script>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/button.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/menu.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/item.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/drop-down.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/menu/context.js?rnd=<?php echo $rnd; ?>"></script>


<script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/grid.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/grid-header.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/menu.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/column-manager.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/row-manager.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/column-move.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/grid/column.js?rnd=<?php echo $rnd; ?>"></script>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/scroller.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/col-resize.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/storage/storage.js?rnd=<?php echo $rnd; ?>"></script>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/button.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/first.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/next.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/previous.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/last.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/page-input.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/page-size.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/current-page.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/total-pages.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/paging/nav-bar.js?rnd=<?php echo $rnd; ?>"></script>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/controller/controller.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/controller/manager.js?rnd=<?php echo $rnd; ?>"></script>

<script type="text/javascript" src="<?php echo $prefix; ?>../src/color/base.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/color/boxes.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/color/color.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/color/named-colors.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/color/rgb-colors.js?rnd=<?php echo $rnd; ?>"></script>


<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/add-on.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/base.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/fragment.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/needle.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/pie-slice.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/pie-slice-highlighted.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/record.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/tooltip.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/gauge.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/chart.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/pie.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/label-list.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/label-list-item.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/data-source.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/scatter-data-source.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/bar.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/text.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/chart-labels.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/chart-values.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/bar-item.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/line.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/line-item.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/line-dot.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/area.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/outline.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/scatter.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/scatter-series.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/line-util.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/bg-lines.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/chart-util.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/chart/ticks.js?rnd=<?php echo $rnd; ?>"></script>


<script type="text/javascript" src="<?php echo $prefix; ?>../src/movable.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/collection-view.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/tree/tree.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/tree/drag-drop.js?rnd=<?php echo $rnd; ?>"></script>


<script type="text/javascript" src="<?php echo $prefix; ?>../src/dialog/dialog.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/dialog/alert.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/dialog/confirm.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/dialog/prompt.js?rnd=<?php echo $rnd; ?>"></script>
<script type="text/javascript" src="<?php echo $prefix; ?>../src/theme/themes.js?rnd=<?php echo $rnd; ?>"></script>


    
