import Pressable from '@components/atoms/pressable';
import Text from '@components/atoms/text';
import theme from '@components/atoms/theme';
import { FlashList } from '@shopify/flash-list';
import { memo } from 'react';
import Image from '@components/atoms/image';

type UserType = {
    profile: string;
    name: string;
    username: string;
  };

interface LikesProps {
    people: UserType[];
    like: number;
    reply: number;
}

export const Likes = memo((props: LikesProps) => {
    const {people} = props;
    return(
        <Pressable spacing={4} borderRadius={24} items="center">
          <FlashList
            data={people}
            horizontal
            scrollEnabled={false}
            estimatedItemSize={22}
            renderItem={({item, index: i}) => (
              <Image
                key={item.profile}
                uri={item.profile}
                style={{
                  marginLeft: i ? -8 : 0,
                }}
              />
            )}
          />
          <Text type="l1" weight="bold" color={theme.pallate.neutral['01']} text={people[0].username} />
          <Text type="l1" color={theme.pallate.neutral['01']}  text="and others bam the post"/>
        </Pressable>
    );
});

export default Likes;
