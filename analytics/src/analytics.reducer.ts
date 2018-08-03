import { AnalyticsActions, AnalyticsActionsType } from './analytics.action';
import { AnalyticsState } from './analytics.state';

const DEFAULT_STATE = new AnalyticsState({ events: [], properties: [], propertiesVersions: [], responses: [] });

export function analyticsReducer(state: AnalyticsState = DEFAULT_STATE, action: AnalyticsActionsType) {
  switch (action.type) {
    case AnalyticsActions.UPDATE_PROPERTY: {
      const payload = action.payload;
      const result = { ...state };
      const property = payload.property;
      if (property.value === undefined || property.value === '') {
        return result;
      }
      const override = payload.override;
      const index = state.properties.findIndex(val => val.name === property.name);
      let modified = false;

      if (index === -1) {
        result.properties = [...result.properties, property];
        modified = true;
      } else if (override) {
        result.properties = [...result.properties];
        result.properties[index] = property;
        modified = true;
      }

      if (modified) {
        result.propertiesVersions.push(state.properties);
        result.propertiesVersions.splice(10, 100);
      }

      return result;
    }
    case AnalyticsActions.DELETE_PROPERTY: {
      const payload = action.payload;
      const result = { ...state };
      const index = result.properties.findIndex(val => val.name === payload);
      if (index > -1) {
        result.properties.splice(index, 1);
        result.properties = [...result.properties];
        result.propertiesVersions.push(state.properties);
        result.propertiesVersions.splice(10, 100);
      }
      return result;
    }
    case AnalyticsActions.SEND_EVENT: {
      const payload = action.payload;
      const result = { ...state };
      result.events.push(payload);
      result.events.splice(10, 100);
      return result;
    }
    case AnalyticsActions.SEND_RESPONSE: {
      const payload = action.payload;
      const result = { ...state };
      result.responses.push(payload);
      result.responses.splice(10, 100);
      return result;
    }
    default: {
      return state;
    }
  }
}
