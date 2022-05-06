import React, { ImgHTMLAttributes } from 'react';

import { getSource } from '../../util/image/util';

export interface Properties extends ImgHTMLAttributes<HTMLImageElement> {
  className: string;
}

export default class Image extends React.Component<Properties> {
  render() {
    const { className, src, ...rest } = this.props;

    return <img className={className} src={getSource(src)} {...rest} />;
  }
}
