import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import FolderIcon from '@material-ui/icons/Folder';
import DescriptionIcon from '@material-ui/icons/Description';
import Button, { ButtonGroup } from '@atlaskit/button';
import { NewFileIcon, NewFolderIcon } from './CustomIcons';
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from '../../packages/react-vertical-timeline/src/index';
import '../../packages/react-vertical-timeline/src/VerticalTimeline.css';
import '../../packages/react-vertical-timeline/src/VerticalTimelineElement.css';
import './Timeline.css';
import { log } from './Logger';
import { TimelineData, loadFolder } from './FileOp';

interface TimelineHeaderProp {
  title: string;
}

function capString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTimelineContent(
  elements: TimelineData[],
  clickCB: (e: React.MouseEvent) => void
) {
  const propsFile = {
    date: '2023',
    className: 'vertical-timeline-element--work',
    contentArrowStyle: { borderRight: '7px solid  rgb(33, 150, 243)' },
    iconStyle: { background: 'rgb(33, 150, 243)', color: '#fff' },
    icon: <DescriptionIcon />,
  };

  const propsFolder = {
    date: '2023',
    className: 'vertical-timeline-element--education',
    contentArrowStyle: { borderRight: '7px solid  rgb(233, 30, 99)' },
    iconStyle: { background: 'rgb(233, 30, 99)', color: '#fff' },
    icon: <FolderIcon />,
  };

  const getProps = (element: TimelineData) => {
    const props = element.isFile ? propsFile : propsFolder;
    props.date = element.modifyTime.toLocaleString();
    return props;
  };

  return elements.map((element) => {
    const props = getProps(element);
    return (
      <VerticalTimelineElement
        {...props}
        key={element.key}
        id={element.key}
        isFile={element.isFile}
        onTimelineElementClick={clickCB}
      >
        <h3 className="vertical-timeline-element-title">{element.title}</h3>
        {/* <h4 className="vertical-timeline-element-subtitle">
          {element.subtitle}
        </h4> */}
        <p
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: `${element.content}<br>......` }}
        />
      </VerticalTimelineElement>
    );
  });
}

function TimelineHeader({ title }: TimelineHeaderProp) {
  return (
    <div id="timeline_toolbar">
      <h1 id="timeline_title">{title}</h1>
      <div id="timeline_buttons">
        <ButtonGroup appearance="primary">
          <Button iconBefore={<NewFolderIcon label="" size="small" />}>
            New Folder
          </Button>
          <Button iconBefore={<NewFileIcon label="" size="small" />}>
            New Project Note
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default function Timeline() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id, title, selCB } = state; // Read values passed on state
  const [currentLocation, setCurrentLocation] = useState('');
  const [elements, setElements] = useState<TimelineData[]>([]);

  const location = useLocation();
  if (location.key !== currentLocation) {
    setCurrentLocation(location.key);
    log('loadData for ', id);
    loadFolder(id, (data) => {
      setElements(data);
    });
  }

  function onElementClicked(event: React.MouseEvent) {
    const current = event?.currentTarget;
    if (current) {
      const keys = current.getAttribute('id');
      const eleTitle = current.querySelector('h3')?.textContent;
      const keyPairs = keys?.split('#');
      if (keyPairs?.length === 2) {
        const isFile = JSON.parse(keyPairs[1]);
        log('navigate from timeline', keyPairs[0], isFile, eleTitle);
        selCB(keyPairs[0]);
      }
    }
  }

  const timelineEle = getTimelineContent(elements, onElementClicked);

  return (
    <div id="timeline_root">
      <TimelineHeader title={capString(title)} />
      <VerticalTimeline>{timelineEle}</VerticalTimeline>
    </div>
  );
}
