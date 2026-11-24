// Components available inside every .mdx project page or blog post without importing them.
import TextBlock from './TextBlock.astro';
import FullImage from './FullImage.astro';
import MediaText from './MediaText.astro';
import Quote from './Quote.astro';
import Video from './Video.astro';
import Links from './Links.astro';

export const blocks = { TextBlock, FullImage, MediaText, Quote, Video, Links };
