import * as React from 'react';
import classNames from 'classnames';
import GitHubButton from 'react-github-button';

export interface GithubProps {
  responsive: null | 'narrow' | 'crowded';
}

export default ({ responsive }: GithubProps) => (
  <GitHubButton
    id="github-btn"
    className={classNames({
      'responsive-mode': responsive,
      [`responsive-${responsive}`]: responsive,
    })}
    type="stargazers"
    namespace="ant-design"
    repo="ant-design"
  />
);
