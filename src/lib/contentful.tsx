import React from 'react';
import { Asset } from 'contentful';
import { BLOCKS, Block, Inline } from '@contentful/rich-text-types';
import { RenderNode } from '@contentful/rich-text-react-renderer';

import { ChangePassword } from '../components/blueprints/ChangePassword';
import { Projects } from '../components/blueprints/Projects';
import { TimeTracking } from '../components/blueprints/TimeTracking';
import { Blog } from '../components/blueprints/Blog';

interface AssetBlock extends Block {
  data: {
    asset: Asset
  }
}

const renderAsset = (assetBlock: Block | Inline) => {
  const { data: { asset: { fields: { title, file } } } } = assetBlock as AssetBlock;

  return <img src={file.url} alt={title} />;
};

export const mapWidgets = (): RenderNode => ({
  blog: () => <Blog />,
  'change-password': () => <ChangePassword />,
  'time-tracking': () => <TimeTracking />,
  'project-editor': () => <Projects />,
  [BLOCKS.EMBEDDED_ASSET]: renderAsset,
});
