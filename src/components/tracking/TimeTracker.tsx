import React, {
  FC, useState, useRef, MouseEvent, useEffect,
} from 'react';
import { css } from '@emotion/core';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { Tracking } from '../../graphql/hooks';

interface TimeTrackerProps {
  tracking?: Tracking,
  onSubmit: (e: MouseEvent<HTMLFormElement>, startTime: string, endTime: string, description: string) => void;
  onCancelEdit?: () => void;
}

export const TimeTracker: FC<TimeTrackerProps> = ({ onSubmit, onCancelEdit, tracking }) => {
  const isEdit = !!tracking;
  const [startTime, setStartTime] = useState<Date|null>(new Date());
  const [endTime, setEndTime] = useState<Date|null>(new Date());
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (tracking) {
      setStartTime(new Date(tracking.startTime));
      setEndTime(new Date(tracking.endTime));
      if (descriptionRef.current) {
        descriptionRef.current.value = tracking.description;
      }
    }
  }, [tracking]);

  const formCss = css`
    display: grid;
    grid-template:
      "labelFrom labelTo quickSelect" max-content
      "datePickerFrom datePickerTo quickSelect" max-content
      "description description quickSelect" max-content
      "actionButtons actionButtons quickSelect" max-content
      "popper popper quickSelect" max-content
      / 1fr 1fr 1fr
    ;
    gap: 10px;

    .datePickerFrom {
      grid-area: datePickerFrom;
    }

    .datePickerTo {
      grid-area: datePickerTo;
    }

    .quickSelect {
      grid-area: quickSelect;

      button {
        font-size: smaller;
        display: block;
      }
    }

    .actionButtons {
      grid-area: actionButtons;
      display: flex;
      button {
        flex: 1;
      }
    }
  `;

  const setDescription = (description: string) => {
    if (descriptionRef.current) {
      descriptionRef.current.value = description;
    }
  };

  const onSubmitProxy = (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      throw new Error(`startTime and endTime must be valid dates. ${startTime} and ${endTime} given.`);
    }
    const description = descriptionRef.current?.value ?? '';
    onSubmit(e, startTime.toISOString(), endTime.toISOString(), description);
  };

  const onCancelEditProxy = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStartTime(new Date());
    setEndTime(new Date());
    setDescription('');
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const quickSelect = (e: MouseEvent<HTMLButtonElement>) => {
    switch (e.currentTarget.value) {
      case 'today-8-16': {
        const quickStartTime = new Date();
        quickStartTime.setHours(8);
        quickStartTime.setMinutes(0);
        quickStartTime.setSeconds(0);
        quickStartTime.setMilliseconds(0);
        setStartTime(quickStartTime);

        const quickEndTime = new Date(quickStartTime);
        quickEndTime.setHours(16);
        setEndTime(quickEndTime);
        if (descriptionRef.current) {
          descriptionRef.current.value = '';
        }
        break;
      }
      default:
        break;
    }
  };

  const dateFormat = 'dd.MM.yyyy HH:mm';

  return (
    <form onSubmit={onSubmitProxy} css={formCss}>
      <label css={{ gridArea: 'labelFrom' }} htmlFor="from">From:</label>
      <div className="datePickerFrom">
        <DatePicker
          id="from"
          required
          disabled={isEdit}
          selected={startTime}
          showTimeSelect
          onChange={setStartTime}
          dateFormat={dateFormat}
          showWeekNumbers
        />
      </div>
      <label css={{ gridArea: 'labelTo' }} htmlFor="to">To:</label>
      <div className="datePickerTo">
        <DatePicker
          id="to"
          required
          selected={endTime}
          showTimeSelect
          onChange={setEndTime}
          dateFormat={dateFormat}
          showWeekNumbers
        />
      </div>
      <textarea required css={{ gridArea: 'description' }} ref={descriptionRef} />
      <div className="quickSelect">
        <fieldset>
          <legend>Quickselect</legend>
          <button disabled={isEdit} value="today-8-16" type="button" onClick={quickSelect}>Today 8-16</button>
        </fieldset>
      </div>
      <div className="actionButtons">
        {isEdit && <button type="button" onClick={onCancelEditProxy}>Cancel</button>}
        <button type="submit">Save</button>
      </div>
    </form>
  );
};
