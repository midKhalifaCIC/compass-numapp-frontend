import React from 'react';
import { Button, Icon, View, I18nManager } from 'react-native';
import config from '../../config/configProvider';
import exportService from '../../services/questionnaireAnalyzer/questionnaireAnalyzer';
import ProgressBar from './progressbar';
import localization from '../../services/localization/localization';

/**
 * creates the bottom-navigation-bar of the modal
 * @param {object} props the props of this component
 * @param {number} props.currentPageIndex the current page index, i.e. the number of the question within the current category
 * @param {number} props.currentCategoryIndex the current category index, i.e. the number of the first level index
 * @param {QuestionnaireItem[]} props.categories the list of all categories, i.e. the first level items
 * @param {Object<Function>} props.actions
 * @param {Function } props.handleBackPress handler for the back button
 * @param {Object<Function>} props.handleForwardPress handler for the forward button
 *
 */
function BottomBar({
  currentPageIndex,
  currentCategoryIndex,
  categories,
  actions,
  handleBackPress,
  handleForwardPress,
}) {
  return (
    <View
      style={
        config.appConfig.useProgressBar
          ? localStyle.bottomBarWrapper
          : localStyle.bottomBarWrapperWithShadow
      }
    >
      {config.appConfig.useProgressBar && (
        <ProgressBar
          progress={
            config.appConfig.useStrictModeProgressBar
              ? exportService.calculatePageProgress(this.props)
              : currentPageIndex / categories[currentCategoryIndex].item.length
          }
        />
      )}

      <View style={localStyle.bottomBarButtons}>
        {/* the left navigational button if we're not on page 1 */}
        {currentPageIndex > 1 && (
          <Button
            type="clear"
            accessibilityLabel={localization.translate('accessibility').back}
            accessibilityRole={
              localization.translate('accessibility').types.button
            }
            accessibilityHint={
              localization.translate('accessibility').questionnaire
                .leftButtonHint
            }
            onPress={() => {
              setAccessibilityResponder(this.modalTitleRef);
              this.lastPageNavigationWasForwards = false;
              actions.switchContent(false);
              this.handleScrollTo({ y: 0, animated: false });
            }}
            style={localStyle.modalPaginationButton}
            icon={
              <Icon
                name={I18nManager.isRTL ? 'arrow-right' : 'arrow-left'}
                type="material-community"
                color={config.theme.colors.accent4}
              />
            }
          />
        )}

        {/* placeholder for the button on the left side if we're on page 1 */}
        {currentPageIndex === 1 && (
          <View
            style={{
              ...localStyle.modalPaginationButton,
              ...localStyle.modalPaginationButtonLeft,
            }}
          />
        )}

        {/* the confirmation button in the middle - its color depends on checkCurrentPageState() */}
        <Button
          type="clear"
          accessibilityLabel={
            this.checkCurrentPageState()
              ? localization.translate('accessibility').questionnaire
                  .middleButtonFinished
              : localization.translate('accessibility').questionnaire
                  .middleButtonUnfinished
          }
          accessibilityRole={
            localization.translate('accessibility').types.button
          }
          accessibilityHint={
            localization.translate('accessibility').questionnaire
              .middleButtonHint
          }
          onPress={() => {
            setAccessibilityResponder(this.modalTitleRef);
            this.lastPageNavigationWasForwards = true;
            actions.switchContent(
              true,
              categories[currentCategoryIndex].item.length,
              currentPageIndex,
            );
            this.handleScrollTo({ y: 0, animated: false });
          }}
          icon={
            <Icon
              name="check"
              reverse
              type="material-community"
              color={
                this.checkCurrentPageState()
                  ? config.theme.colors.success
                  : config.theme.colors.accent4
              }
            />
          }
        />

        {/* navigational button on the right side - if we're not the last page
					accessibility: if VoiceOver/TalkBalk is on, we use this button for the closing mechanism,
					as the middle button can be used to go to the next page. */}
        {currentPageIndex < categories[currentCategoryIndex].item.length && (
          <Button
            type="clear"
            accessibilityLabel={localization.translate('accessibility').close}
            accessibilityRole={
              localization.translate('accessibility').types.button
            }
            accessibilityHint={
              localization.translate('accessibility').questionnaire
                .rightButtonHint
            }
            onPress={() => {
              if (!this.isAccessibilityOn) {
                setAccessibilityResponder(this.modalTitleRef);
                this.lastPageNavigationWasForwards = true;
                actions.switchContent(true);
                this.handleScrollTo({ y: 0, animated: false });
              } else {
                // when accessibility features are enabled, user should be able to close modal with this button
                actions.hideQuestionnaireModal();
              }
            }}
            style={localStyle.modalPaginationButton}
            icon={
              <Icon
                name={
                  this.isAccessibilityOn
                    ? 'close'
                    : I18nManager.isRTL
                    ? 'arrow-left'
                    : 'arrow-right'
                }
                type="material-community"
                color={config.theme.colors.accent4}
              />
            }
          />
        )}

        {/* placeholder in for the button on the right side - if we're on the last page */}
        {currentPageIndex === categories[currentCategoryIndex].item.length && (
          <View
            style={{
              ...localStyle.modalPaginationButton,
              ...localStyle.modalPaginationButtonRight,
            }}
          />
        )}
      </View>
    </View>
  );
}

const localStyle = StyleSheet.create({
  bottomBarWrapper: {
    backgroundColor: config.theme.values.defaultModalBottomBarBackgroundColor,
  },

  bottomBarWrapperWithShadow: {
    backgroundColor: config.theme.values.defaultModalBottomBarBackgroundColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },

  bottomBarButtons: {
    flexWrap: 'nowrap',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default BottomBar;
