<template>
  <div class="overlay-container font-roboto">
    <div class="w-full">
      <div
        id="tableWrapper"
        class="grid"
        :style="!isSub ? 'grid-template-columns: 313px minmax(80px, 1fr)' : ''"
      >
        <div v-if="!isSub" class="border-r border-original-400">
          <div
            v-for="(label, index) in formattedLabels"
            :key="`label-${label.sourceName}-${index}`"
            class="border-b border-transparent"
            :class="[
              {
                '!border-original-200':
                  (!label.isChild && isCollapsed(label.sourceName)) ||
                  (label.isLastChild && !label.hasMoreAfter) ||
                  label.shouldLoadMore,
                'select-none hover:bg-original-100 cursor-pointer':
                  label.isParent || label.shouldLoadMore
              },
              'h-10 px-6 flex items-center justify-left'
            ]"
            :style="`grid-area: 1 / 1 / span 1 / span 1;`"
            @click="
              label.isParent
                ? updateCollapse(label.sourceName)
                : label.shouldLoadMore
                ? loadMore(label.sourceName)
                : null
            "
          >
            <template v-if="label.shouldLoadMore">
              <div
                class="flex items-center"
                :class="label.indent ? 'ml-10' : 'ml-6'"
              >
                <BaseSpinner
                  v-if="label.isLoading"
                  size="20"
                  class="mr-2 text-original-800"
                />
                <BaseSVG
                  v-else
                  name="download-2-line"
                  size="20"
                  class="mr-2 text-original-800"
                />
                <p
                  :class="
                    isSaving(label.sourceName)
                      ? 'cursor-not-allowed '
                      : 'cursor-pointer '
                  "
                >
                  {{ label.value }}
                </p>
              </div>
            </template>
            <template v-else-if="label.isParent">
              <div
                class="flex items-center cursor-pointer flex-shrink-0 space-x-1"
                :class="[{ 'ml-4': label.indent }]"
              >
                <BaseSpinner v-if="label.isLoading" size="20" />
                <BaseSVG
                  v-else
                  name="arrow-right-s-fill"
                  size="20"
                  :class="[
                    'text-original-500 transition-transform',
                    { 'rotate-90': !label.collapsed }
                  ]"
                />
                <BaseSVG
                  v-if="label.icon"
                  :name="label.icon.name"
                  size="20"
                  :style="{
                    color: label.icon.color,
                    stroke: label.icon.stroke
                  }"
                />
                <BaseSVG
                  v-else-if="label.color"
                  name="rectangle-flowlity-3"
                  size="20"
                  :style="{ color: label.color }"
                />
                <span :class="{ 'font-medium': label.isMediumFont }">
                  {{ label.value }}
                </span>
              </div>
            </template>
            <template v-else-if="label.isChild">
              <BaseTooltip
                placement="top"
                :content="label.value"
                :class="label.indent ? 'ml-10' : 'ml-6'"
              >
                <div class="flex items-center space-x-1">
                  <BaseSVG
                    v-if="label.icon"
                    :name="label.icon.name"
                    size="20"
                    :style="{
                      color: label.icon.color,
                      stroke: label.icon.stroke
                    }"
                  />
                  <BaseSVG
                    v-else-if="label.color"
                    name="rectangle-flowlity-3"
                    size="20"
                    :style="{ color: label.color }"
                  />
                  <div class="leading-4">
                    <p
                      class="whitespace-nowrap max-w-[240px] truncate"
                      :class="{ 'font-medium': label.isMediumFont }"
                    >
                      {{ label.value }}
                    </p>
                    <p
                      v-if="label.isSimulationOnly"
                      class="text-original-500 text-xs"
                    >
                      {{ $t("baseTable.simulation") }}
                    </p>
                  </div>
                </div>
              </BaseTooltip>
            </template>
            <template v-else>
              <div
                class="flex items-center space-x-1"
                :class="{
                  'ml-4': label.indent,
                  'font-medium': label.isMediumFont
                }"
              >
                <BaseSVG
                  v-if="label.icon"
                  :name="label.icon.name"
                  size="20"
                  :style="{
                    color: label.icon.color,
                    stroke: label.icon.stroke
                  }"
                />
                <BaseSVG
                  v-else-if="label.color"
                  name="rectangle-flowlity-3"
                  size="20"
                  :style="{ color: label.color }"
                />
                <span>
                  {{ label.value }}
                </span>
              </div>
            </template>
          </div>
        </div>
        <div
          ref="roll"
          class="flex"
          :style="`
          ${!isSub ? 'gridArea: 1 / 2 / span 1 / span 1; ' : ''}
          overflowX: ${isSub ? 'inherit' : 'auto'}
        `"
        >
          <div
            v-if="canLoadOlderData && !isSub"
            class="w-16 flex items-center justify-center bg-original-100 border-r border-original-400 text-original-500"
            :class="{
              'hover:bg-original-200 cursor-pointer': !loadingOlderData
            }"
            @click="loadOlderData"
          >
            <BaseSpinner v-if="loadingOlderData" size="24" />
            <BaseSVG
              v-else
              name="history-line"
              size="24"
              :title="$t('baseTable.loadOlderData')"
              class="cursor-pointer"
            />
          </div>
          <div class="grid w-full text-original-800">
            <HeaderLineItem
              v-if="headers && !isSub"
              :headers="headers"
              :index-fixing-reco-date="indexFixingRecoDate"
              :index-hover-fixing-reco-date="indexHoverFixingRecoDate"
              v-on="$listeners"
            />
            <div v-for="(row, index) in bodyData" :key="`bodyData-${index}`">
              <template v-if="row.isParent && !isCollapsed(row.sourceName)">
                <MultiLineItem
                  :key="`multilineItem-${parentName}${row.sourceName}-${index}`"
                  :view="view"
                  :data="row"
                  :headers="headers"
                  :hidden-items-count="hiddenItemsCount"
                  :name="row.sourceName"
                  :is-editable="isEditable"
                  v-on="$listeners"
                />
              </template>

              <component
                :is="lineItemByType(row)"
                v-else
                :data="row"
                :name="row.sourceName"
                :is-last="isLast(index, row.parent)"
                :hidden-items-count="hiddenItemsCount"
                :is-editable="isEditable"
                v-on="$listeners"
              />
            </div>
            <div
              v-if="shouldLoadMore"
              class="h-10 border-b border-original-200"
            />
          </div>
        </div>
      </div>
      <div v-if="shouldLoadMore" class="h-full flex" />
    </div>
  </div>
</template>

<script lang="js">
import BasicLineItem from "./lineItems/BasicLineItem.vue";
import HeaderLineItem from "./lineItems/HeaderLineItem.vue";
import MultiLineItem from "./lineItems/MultiLineItem.vue";
import InputLineItem from "./lineItems/InputLineItem.vue";
import BaseTooltip from "@/components/contents/common/BaseTooltip.vue";
import BaseButton from "@/components/base/components/button/BaseButton.vue";
import { ROW_TYPE, SAVING_STATUS } from "./utils/base";
import BaseSVG from "@/components/base/components/BaseSVG.vue";
import BaseSpinner from "@/components/base/components/BaseSpinner.vue";

export default {
  name: "FlowTable",
  components: {
    BaseSpinner,
    BaseSVG,
    HeaderLineItem,
    MultiLineItem,
    BaseTooltip,
    BaseButton
  },
  props: {
    view: {
      type: String,
      required: true,
      validator(view) {
        return ["demand", "planning"].includes(view);
      }
    },
    headers: {
      type: Array,
      required: false,
      default: undefined
    },
    bodyData: {
      type: Array,
      required: false,
      default: () => []
    },
    shouldLoadMore: {
      type: Boolean,
      required: false,
      default: false
    },
    parentName: {
      type: String,
      required: false,
      default: ""
    },
    savingDraft: {
      type: Boolean,
      required: false,
      default: false
    },
    loadingOlderData: {
      type: Boolean,
      required: false,
      default: false
    },
    loadOlderDataMode: {
      type: Boolean,
      required: false,
      default: false
    },
    hiddenItemsCount: {
      type: Number,
      required: false,
      default: 0
    },
    isEditable: {
      type: Boolean,
      default: true
    },
    indexFixingRecoDate: {
      type: [Number, null],
      required: false,
      default: () => null
    },
    indexHoverFixingRecoDate: {
      type: [Number, null],
      required: false,
      default: () => null
    }
  },
  emits: ["action:set-begin-date", "update:collapse", "action:load-more"],
  data() {
    return {
      isSub: !!this.parentName,
      isLoading: this.loadingOlderData
    };
  },
  computed: {
    canLoadOlderData() {
      return this.loadOlderDataMode;
    },
    formattedLabels() {
      const data = this.headers ? [""] : [];
      //TODO: refacto this part
      this.bodyData.forEach(element => {
        data.push({
          value: element.displayName || element.sourceName,
          color: element.asideColor,
          icon: element.icon,
          indent: element.indent,
          sourceName: element.sourceName,
          collapsed: element?.collapsed ?? true,
          isParent: element.isParent,
          isLoading: element.isLoading,
          isMediumFont: element.isMediumFont
        });
        if (
          element?.isParent &&
          element?.collapsed === false &&
          element?.subItems
        ) {
          element.subItems.forEach((subItem, index) => {
            data.push({
              isChild: true,
              isLastChild: index === element.subItems.length - 1,
              hasMoreAfter: element.shouldLoadMore,
              color: subItem.asideColor,
              indent: element.indent || subItem.indent,
              parent: element.sourceName,
              value: subItem.displayName || subItem.sourceName,
              sourceName: subItem.sourceName,
              collapsed: subItem.collapsed || true,
              isSimulationOnly: subItem.isSimulationOnly || false,
              icon: subItem.icon,
              isMediumFont: subItem.isMediumFont
            });
          });
          if (element.shouldLoadMore) {
            data.push({
              isChild: true,
              value: "Load more",
              indent: element.indent,
              isLoading: element.isLoading,
              sourceName: element.sourceName,
              collapsed: true,
              shouldLoadMore: element.shouldLoadMore
            });
          }
        }
      });
      return data;
    }
  },
  mounted() {
    this.scrollOverOlderDataToggle();
  },
  methods: {
    scrollOverOlderDataToggle() {
      if (this.isSub || this.view === "planning") return;

      this.$nextTick(() => {
        this.$refs.roll.scrollTo({
          // width of button "load older data"
          left: 64,
          behavior: "smooth"
        });
      });
    },
    loadOlderData() {
      if (this.loadingOlderData) {
        return;
      }
      this.$emit("action:set-begin-date", -6);
      this.isLoading = true;
    },
    isSaving(sourceName) {
      const source = this.bodyData.find(
        element => element.sourceName === sourceName
      );
      return source.savingStatus === SAVING_STATUS.PENDING;
    },
    isLast(index) {
      return (
        index === this.bodyData.length - 1 &&
        this.bodyData[index]?.collapsed !== false &&
        !this.shouldLoadMore
      );
    },
    isCollapsed(sourceName) {
      return (
        this.bodyData.find(source => source.sourceName === sourceName)
          ?.collapsed ?? true
      );
    },
    loadMore(sourceName) {
      if (!this.isSaving(sourceName))
        this.$emit("action:load-more", sourceName);
    },
    lineItemByType(row) {
      const type = row.type === ROW_TYPE.MULTI_ROW ? row.childType : row.type;
      switch (type) {
        case ROW_TYPE.INPUT:
          return InputLineItem;
        default:
          return BasicLineItem;
      }
    },
    updateCollapse(label) {
      this.$emit("update:collapse", label);
    }
  }
};
</script>

<style scoped lang="scss">
.overlay-container {
  position: relative;
}

#tableWrapper {
  width: 100%;
  display: grid;
}

#content {
  width: 100%;
  display: grid;
  grid-template-rows: min-content auto;
  grid-template-columns: minmax(250px, 1fr);
}

#overlay {
  position: absolute; /* Sit on top of the page content */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: not-allowed; /* Add a pointer on hover */
}

.bg-fl-platinum {
  --bg-opacity: 1;
  background-color: #ecf1fb;
  background-color: rgba(236, 241, 251, var(--bg-opacity));
}

.aside-cell {
  position: fixed;
  padding-left: 50px;
  margin-left: -160px;
  background: white;
}

.flex {
  display: flex;
  display: -ms-flexbox;
  display: -webkit-box;
}
</style>
