import { push } from 'react-router-redux';

import constants from '../constants.js';

export const SET_URL_MAPPING = 'SET_URL_MAPPING';
export const UPDATE_URL_MAPPING = 'UPDATE_URL_MAPPING';
export const REMOVE_URL_MAPPING = 'REMOVE_URL_MAPPING';
export const TOGGLE_URL_MAPPING = 'TOGGLE_URL_MAPPING';
export const SYNC_URL_MAPPINGS = 'SYNC_URL_MAPPINGS';

export const NEW_MAPPING_UPDATE = 'NEW_MAPPING_UPDATE';
export const NEW_MAPPING_NEXT = 'NEW_MAPPING_NEXT';
export const NEW_MAPPING_RESET = 'NEW_MAPPING_RESET';

export function showAddUrlMapping(url) {
  return (dispatch) => {
    dispatch(push({
      pathname: '/url-mappings'
    }));
    dispatch(updateNewMapping({
      target: url
    }));
  };
}

export function setUrlMapping(url, newUrl, isLocal = false, isActive = true) {
  return {
    type: SET_URL_MAPPING,
    mapping: {
      url,
      newUrl,
      isLocal,
      isActive
    }
  };
}

export function removeUrlMapping(url) {
  return {
    type: REMOVE_URL_MAPPING,
    mapping: {
      url
    }
  };
}

export function toggleUrlMapping(url) {
  return {
    type: TOGGLE_URL_MAPPING,
    mapping: {
      url
    }
  };
}

export function syncUrlMappings({mappings}) {
  return {
    type: SYNC_URL_MAPPINGS,
    mappings
  };
}

export function updateNewMapping(mapping) {
  return {
    type: NEW_MAPPING_UPDATE,
    mapping
  };
}

export function nextNewMapping(isLocal) {
  return {
    type: NEW_MAPPING_NEXT,
    step: constants.NEW_MAPPING_STEP_DESTINATION,
    isLocal
  };
}

export function resetNewMapping() {
  return {
    type: NEW_MAPPING_RESET
  };
}
