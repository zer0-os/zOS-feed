import React from 'react';

import { ImageFetchOptions } from '../../lib/image/cdn';
import { getSource } from '../../lib/image/util';
import { AdvancedImage } from "@cloudinary/react";


export interface Properties {
  sourceUrl: string;
  options?: ImageFetchOptions;
  title?: string;
  classImage?: string
}


export default class BackgroundImage extends React.Component<Properties> {
  cloudinaryUrl: any = null;
  

  componentDidMount() {
    this.initialLoad();
  }

  initialLoad = () => {
    if (this.hasSource()) {
      this.cloudinaryUrl = getSource(this.props.sourceUrl);
      console.log('this.cloudinaryUrl $$$$$$$',this.cloudinaryUrl)
    }
  }

  hasSource = (props = this.props) => {
    return !!props.sourceUrl;
  }

  render() {
    const { title, classImage } = this.props;

    return (
      <img className={classImage} alt={title} src={this.cloudinaryUrl} />
    );
  }
}
